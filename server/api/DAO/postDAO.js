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

    static async getPosts(page) {
        const postsPerPage = 10;
        let cursor;
        try {

            cursor = await Post.find().sort({ "date": -1 });
        }
        catch (e) {
            console.error("Unable to post Post", e);
            return [];
        }
        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page);
        console.log(displayCursor);
        try {
            const posts_list = await displayCursor.toArray();
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
                        //el1 : "$reacted_by.0.ReactedBy_id"},
                        //el2 : {"$set":"$react_obj.0.ReactedBy_id"}
                    }
                }
            ]
            const is_exist = await Post.aggregate(pipeline).next();

            console.log("Is exist function returns:", is_exist);
            is_exist.isLiked ? console.log("YEY") : console.log("NAH");
            is_exist;
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

            else{
               // if(is_exist.react_obj[0].Reacted_index){
                let current_index = is_exist.react_obj[0].Reacted_index;
                console.log("current_index:",current_index);
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
                else{
                    console.log("We are here");
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
               // }
            }

        }

        catch (e) {
            console.log("Unable to Update Review");
            return { error: e };
        }
    }

}