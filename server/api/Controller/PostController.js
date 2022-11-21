const { parse } = require("dotenv");
const { post } = require("../../routes/dbGencFootball.js");
const PostDAO = require("../DAO/postDAO.js");

module.exports = class UserController {

    static async apiPostPosts(req,res,next) {

        try{

            const post = {

                user_id : req.body.user_id,
                username : req.body.username,
                post_message : req.body.post_message,
                comments_list : [],
                comments_count : 0,
                reactions_list :[0,0,0,0,0],
                share_count : 0,
                date : new Date()
            };
            const PostdbResponse = await PostDAO.addPost(post);
            res.json({status : "success"});

        }

        catch(e){
            res.status(500).json({error : e.message});
        }
    }

    static async apiGetPosts(req,res,next){
        try {
            //const postPerPage = req.query.postPerPage ? parseInt(req.query.postPerPage,10) : 10;
            const page = req.query.page ? parseInt(req.query.page,10) : 0;
            let posts_list = [];
            PostDAO.getPosts(page).then(
                (data) => {
                    posts_list = data;
                   // console.log({posts_list,page});
                    res.json({posts_list,page});
                }
            ); 
            
        }

        catch(e){
            res.status(500).json({error : e.message});
        }
    }

    static async apiDeletePosts(req,res,next){
        try{
            console.log("hi");
            const user_id = req.query.user_id;
            const post_id = req.query.post_id;
            console.log({user_id,post_id});
            const PostdbResponse = await PostDAO.deletePosts(user_id,post_id);
            console.log(PostdbResponse);
            res.json({status : "success"});
            //console.log(PostdbResponse);
        }
        catch(e) {
            res.status(500).json({error : e.message});
        }
    }

    static async apiUpdatePost(req,res,next){

        try{
            
            const post_id =req.params.post_id;
            const updated_post = {
                user_id : req.body.user_id,
                username : req.body.username,
                post_message : req.body.post_message,
                comments_list : req.body.comments_list,
                comments_count : req.body.comments_count,
                reactions_list : req.body.reactions_list,
                share_count : req.body.share_count,
                date : new Date()
            };
            
            const UserdbResponse = await PostDAO.updatePost(post_id,updated_post);
            
            var {error} = UserdbResponse;
            
            if(error) {
                console.log(error);
                res.status(400).json({error});
            }

            if(UserdbResponse.modifedCount ===0){

                throw new Error("unable to update post - post may not be original poster");
            }
            console.log(UserdbResponse);
            res.json({status : "success"});
        }

        catch(e) {
            res.status(500).json({error: e.message});
        }
    }
}