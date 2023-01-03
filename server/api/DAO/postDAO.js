const mongodb = require("mongodb");
const { post } = require("../../routes/dbGencFootball");
const { apiDeletePosts } = require("../Controller/PostController");
const ObjectId = mongodb.ObjectId;

let Post;

module.exports = class PostDAO {

    static async injectDB(conn) {

        if (Post) {

            return;
        }

        try {

            Post = await conn.db(process.env.ATLAS_DB).collection("posts");
        }

        catch (e) {

            console.error("Unable to establish collection handles in PostDAO", e);
        }
    }

    static async addPost(post) {

        post.user_id = ObjectId(post.user_id);
        try {

            return await Post.insertOne(post);
        }
        catch (e) {
            console.error("Unable to post Post", e);
            return { error: e };
        }
    }

    static async getPosts(page, userid){
        const postsPerPage = 10;
        let cursor;
        try {

            cursor = await Post.aggregate([
                {
                  "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "stage1"
                  }
                },
                {
                  "$unwind": "$stage1"
                },
                {
                  "$lookup": {
                    "from": "followers",
                    "localField": "user_id",
                    "foreignField": "user_id",
                    "as": "stage2"
                  }
                },
                {
                  "$unwind": "$stage2"
                },
                {
                  "$match": {
                    "$or": [
                        {"stage1.isPrivate": false},
                        {"$and": [
                            {"stage1.isPrivate": true},
                            {"stage2.follower_list": {"$in": [ObjectId(userid)]}
                        }]
                },
                      {
                        "user_id": ObjectId(userid)
                      }
                    ]
                  }
                },
                {
                    "$project": {
                        "stage1": 0,
                        "stage2": 0
                    }
                },
                {
                    "$sort": {
                        "date": -1
                    }
                },
                {
                    "$skip": page * postsPerPage
                  },
                  {
                    "$limit": postsPerPage
                  }
              ]);
        }
        catch (e) {
            console.error("Unable to post Post", e);
            return [];
        }
        //console.log(displayCursor);
        try {
            const posts_list = await cursor.toArray();
            console.log(posts_list,page);
            return posts_list;
        }

        catch (e) {
            console.error("Unable to convert cursor to array", e);
            return [];
        }
    }

    static async deletePosts(user_id, post_id) {

        try {
            const deleteResponse = await Post.deleteOne({ user_id: ObjectId(user_id), _id: ObjectId(post_id) });
            return deleteResponse;
        }

        catch (e) {
            console.log("Unable to delete reviews", e);
            return { error: e };
        }
    }

    static async updatePost(post_id, updated_post) {
        try {
            const updateResponse = await Post.updateOne(

                { _id: ObjectId(post_id) },
                {
                    $set: {
                        user_id: ObjectId(updated_post.user_id),
                        username: updated_post.username,
                        post_message: updated_post.post_message,
                        comments_list: updated_post.comments_list,
                        comments_count: updated_post.comments_count,
                        reactions_list: updated_post.reactions_list,
                        share_count: updated_post.share_count,
                        date: updated_post.date
                    }
                }
            );

            return updateResponse;
        }
        catch (e) {
            console.log("Unable to Update Review");
            return { error: e };
        }

    }

    static async AddComment(post_id, comment_info) {
        try {
            const updateResponse = await Post.updateOne(

                { _id: ObjectId(post_id) },
                {
                    $push: {
                        comments_list : {
                        user_id: ObjectId(comment_info.user_id),
                        comment_content : comment_info.comment_content,
                        date : comment_info.date
                        }
                    },
                    "$inc" : {
                        comments_count : 1
                    }
                }
            );
            return updateResponse;
        }
        catch (e) {
            console.log("Unable to Update Review");
            return { error: e };
        }

    }

    static async GetComments(post_id) {
        console.log("You are in GetComments and post id is ",post_id);
        let cursor;
        try {
            cursor = await Post.aggregate([
                {
                    "$match": {
                      _id: ObjectId(post_id)
                    }
                  },
                  {
                    "$unwind": "$comments_list"
                  },
                  {
                    "$lookup": {
                      "from": "users",
                      "localField": "comments_list.user_id",
                      "foreignField": "_id",
                      "as": "comment_info"
                    },

                  },
                  {
                    "$unwind": "$comment_info"
                  },
            ]);
        }
        catch (e) {
            console.error("Unable to Get Comments of the Posts", e);
            return [];
        }

        //const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page);
        try {
            const posts_list = await cursor.toArray();
            console.log("Posts_list is", posts_list);
            return posts_list;
        }

        catch (e) {
            console.error("Unable to convert cursor to array", e);
            return [];
        }
    }

    static async updatePostReaction(post_id, Reaction_info) {
        try {
           /* const is_exist = await Post.findOne(
                { _id: ObjectId(post_id) },
                {
                    projection: {
                        isLiked: {
                            "$in": [
                                ObjectId(Reaction_info.reactedby_id),
                                "$reacted_by.ReactedBy_id"
                            ]
                        },
                        react_obj1:{
                                $in : [ObjectId(Reaction_info.reactedby_id),"$reacted_by.ReactedBy_id"]
                        },
                        reacted_by:1,
                        _id: 0
                    }
                }
            );*/

            //CHECK WHETHER USER HAS REACTED TO POST
            const pipeline = [
                {$match : {_id : ObjectId(post_id)}},
                {
                    $project: {
                        isLiked:{
                            "$in": [
                                ObjectId(Reaction_info.reactedby_id),
                                "$reacted_by.ReactedBy_id"
                            ]
                        },
                        
                        react_obj: {
                                    $filter: 
                                    {
                                        input: "$reacted_by",
                                        as:"item",
                                        cond:{"$eq": ["$$item.ReactedBy_id",ObjectId(Reaction_info.reactedby_id)]}
                                    },
                         
                        },
                         //el1 : {$arrayElemAt : ["$react_obj",0]}
                         index_of_obj: {
                            "$indexOfArray": ["$reacted_by.ReactedBy_id",ObjectId(Reaction_info.reactedby_id)]
                         }
                    }
                }
            ]
            const is_exist = await Post.aggregate(pipeline).next();

            console.log("Is exist function returns:", is_exist);
            is_exist.isLiked ? console.log("YEY") : console.log("NAH");
            is_exist;
            //IF USER HAS NOT REACTED TO POST INSERT HIS USER_ID and reaction_index TO THE "reacted_by" Array
            if (!is_exist.isLiked) {
                const updateResponse = await Post.updateOne(
                    { _id: ObjectId(post_id) },
                    {
                        "$addToSet": {
                            "reacted_by": {
                                ReactedBy_id: ObjectId(Reaction_info.reactedby_id),
                                Reacted_index: Reaction_info.reacted_index
                            }
                        },
                        "$inc": {
                            [`reactions_list.${Reaction_info.reacted_index}`] : 1 
                        }
                    }
                );
                return updateResponse;
            }
            // USER HAS ALREADY REACTED TO THE POST
            else{
    
                let current_index = is_exist.react_obj[0].Reacted_index;
                console.log("current_index:",current_index);
                // IF USER CLICKS THE SAME REACTION AGAIN REMOVE HIS USERID FROM ARRAY AND DECREMENT THE COUNT FOR THIS REACTION
                if(is_exist.react_obj[0].Reacted_index === Reaction_info.reacted_index){
                    const updateResponse = await Post.updateOne(
                        { _id: ObjectId(post_id) },
                        {
                            "$pull": {
                                "reacted_by": {
                                    ReactedBy_id: ObjectId(Reaction_info.reactedby_id),
                                    Reacted_index: Reaction_info.reacted_index
                                }
                            },
                            "$inc": {
                                [`reactions_list.${Reaction_info.reacted_index}`] : -1 
                            }
                        }
                    );
                    return updateResponse;
                }
                // IF USER WANTS TO CHANGE HIS REACTION, UPDATE THE reacted_index in "reacted_by" ARRAY
                // AND INCREMENT NEW REACTION COUNT AND DECREASE OLD REACTION COUNT
                else{
                    const updateResponse = await Post.updateOne(
                        { _id: ObjectId(post_id) },
                        {
                            
                                "$inc": {
                                    [`reactions_list.${Reaction_info.reacted_index}`] : +1,
                                    [`reactions_list.${current_index}`] : -1 
                                },
                                $set : {
                                    [`reacted_by.${is_exist.index_of_obj}.Reacted_index`] : Reaction_info.reacted_index
                                }
                        }
                    );
                    return updateResponse;
                }
            }

        }

        catch (e) {
            console.log("Unable to Update Review");
            return { error: e };
        }
    }

}