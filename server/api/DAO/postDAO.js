const mongodb = require("mongodb");
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

    static async getPosts(page){
        const postsPerPage = 10;
        let cursor;
        try{

            cursor = await Post.find().sort({"date":-1});
        }
        catch(e){
            console.error("Unable to post Post",e);
            return [];
        }
        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage*page);
        console.log(displayCursor);
        try{
            const posts_list = await displayCursor.toArray();
            //await posts_list.sort((a, b) => {
               // return new Date(b.date) - new Date(a.date);
               // });
            //const posts_list = await 
            return posts_list;
        }

        catch(e){
            console.error("Unable to convert cursor to array",e);
            return [];
        }
    }

}