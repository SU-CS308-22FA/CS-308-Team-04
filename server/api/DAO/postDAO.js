const mongodb = require("mongodb");
const { post } = require("../../routes/dbGencFootball");
const { apiDeletePosts } = require("../Controller/PostController");
const ObjectId = mongodb.ObjectId;

let Post;

module.exports = class PostDAO{

    static async injectDB(conn){

        if (Post){
            
            return;
        }

        try{

            Post= await conn.db(process.env.ATLAS_DB).collection("posts");
        }

        catch(e){
            
            console.error("Unable to establish collection handles in PostDAO",e);
        }
    }
    
    static async addPost(post){

        post.user_id = ObjectId(post.user_id); 
        try{

            return await Post.insertOne(post);    
        }
        catch(e){
            console.error("Unable to post Post",e);
            return {error:e};
        }
    }

    static async getPosts(page, userid){
        const postsPerPage = 10;
        let cursor;
        try{

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
                }
              ]);
        }
        catch(e){
            console.error("Unable to post Post",e);
            return [];
        }
        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage*page);
        console.log(displayCursor);
        try{
            const posts_list = await displayCursor.toArray();
            return posts_list;
        }

        catch(e){
            console.error("Unable to convert cursor to array",e);
            return [];
        }
    }

    static async deletePosts(user_id,post_id){

        try{
            const deleteResponse = await Post.deleteOne({user_id : ObjectId(user_id),_id : ObjectId(post_id)});
            return deleteResponse;
        }

        catch(e){
            console.log("Unable to delete reviews",e);
            return {error:e};
        }
    }

    static async updatePost(post_id, updated_post){
        try{
            const updateResponse = await Post.updateOne(

                {_id : ObjectId(post_id)},
                {$set : {
                    user_id : ObjectId(updated_post.user_id),
                    username : updated_post.username,
                    post_message : updated_post.post_message,
                    comments_list : updated_post.comments_list,
                    comments_count : updated_post.comments_count,
                    reactions_list : updated_post.reactions_list,
                    share_count : updated_post.share_count,
                    date : updated_post.date
                }}
            );

            return updateResponse;
        }
        catch(e){
            console.log("Unable to Update Review");
            return {error:e};
        }

    }

}