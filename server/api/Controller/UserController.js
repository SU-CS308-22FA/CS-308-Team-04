const UserDAO = require("../DAO/userDAO.js");

module.exports = class UserController{

    static async apiGetSpecificUser(req,res,next){
        
        try{
            //let query = {_id : req.params.user_id};
            let user_id = req.params.user_id; 
            console.log(user_id);
            let user = await UserDAO.getoneUserById(user_id);
            if(!user){
                console.log("could not found user!");
                res.status(404).json({error : "Not Found User"});
                return;
            }
            //console.log(query);
            console.log(user);
            res.json(user);     
        }

        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }

    static async apiGetUserByEmail(req,res,next){

        try{
            let user_email = req.params.email;
            console.log(user_email);
            let user = await UserDAO.getoneUserByEmail(user_email);
            if(!user){
                console.log("could not found user!");
                res.status(404).json({error : "Not Found User"});
                return;
            }
            //console.log(query);
            console.log(user);
            res.json(user);     
        }

        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
            
    }
    
    static async apiGetUserWithPost(req,res,next){

        try{
            let user_id = req.params.user_id;
            let user = await UserDAO.getUserPostsWithId(user_id);
            if(!user){
                res.status(404).json({ error: "Not found" })
                return;
            }
            console.log(user);
            res.json(user);
        }

        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }
    
    static async apiPostUser(req,res,next){

        try {
            const user = {
             username : req.body.username,
             password : req.body.password,
             name : req.body.name,
             surname :  req.body.surname,
             email : req.body.email,
             mobile_number : req.body.mobile_number,
             birth_date : req.body.birth_date,
             date : new Date()
            }

        const UserdbResponse = await UserDAO.addUser(user);
        res.json({status : "success"});
        }
        catch(e){

                res.status(500).json({error: e.message});
        }

    }

    static async apiUpdateUser(req,res,next){

        try{
            
            const user_id =req.params.user_id;
            const updated_user = {
                username : req.body.username,
                password : req.body.password,
                name : req.body.name,
                surname :  req.body.surname,
                email : req.body.email,
                mobile_number : req.body.mobile_number,
                birth_date : req.body.birth_date,
                date : new Date()
            };
            
            const UserdbResponse = await UserDAO.updateUser(user_id,updated_user);
            
            var {error} = UserdbResponse;
            
            if(error) {
                console.log(error);
                res.status(400).json({error});
            }

            if(UserdbResponse.modifedCount ===0){

                throw new Error("unable to update review - user may not be original poster");
            }
            console.log(UserdbResponse);
            res.json({status : "success"});
        }

        catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiDeleteUser(req,res,next) {

        try{
            const user_id= req.params.user_id;
            console.log(user_id);
            const UserResponse = await UserDAO.deleteUser(user_id);
            res.json({status : "success"});

            console.log(UserResponse);
        }
        catch(e) {
            res.status(500).json({error : e.message});
        }
    }
}