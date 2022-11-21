const FollowerDAO = require("../DAO/followerDAO.js");
const FollowingDAO = require("../DAO/followingDAO.js");

const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

module.exports = class FollowController{

    static async apiRegisterUserToFollowTable(req,res,next) {
        try {
            const followerEntry = {
                user_id : ObjectId(req.body.user_id),
                follower_count : 0,
                follower_list : []
            }

            const followingEntry = {
                user_id : ObjectId(req.body.user_id),
                following_count : 0,
                following_list : []
            }

        await FollowerDAO.addNewEntry(followerEntry);
        await FollowingDAO.addNewEntry(followingEntry);

        res.json({status : "success"});
        }
        catch(e){

            res.status(500).json({error: e.message});
        }
    }

    static async apiDeleteUserFromFollowTable(req,res,next) {
        try {
            const user_id = req.body.user_id;

            await FollowerDAO.deleteEntry(user_id);
            await FollowingDAO.deleteEntry(user_id);

            res.json({status : "success"});
        }
        catch(e){

            res.status(500).json({error: e.message});
        }
    }

    static async apiAddFollowerAndUpdateCounts(req,res,next) {

        try{
            const user_id= req.body.user_id;
            const other_user_id = req.body.other_user_id;
            console.log(user_id); //
            const FollowerResponse = await FollowerDAO.addFollowerToOtherUserWithID(user_id, other_user_id);
            const FollowingResponse = await FollowingDAO.addFollowingToUserWithID(user_id, other_user_id);

            res.json({status : "success"}); //

            console.log("Follower Response: " + FollowerResponse); //
            console.log("Following Response: " + FollowingResponse); //
        }
        catch(e) {
            res.status(500).json({error : e.message}); //
        }
    }

    static async apiRemoveFollowerAndUpdateCounts(req,res,next) {

        try{
            const user_id= req.body.user_id;
            const other_user_id = req.body.other_user_id;
            console.log(user_id); //
            const FollowerResponse = await FollowerDAO.removeFollowerFromOtherUserWithID(user_id, other_user_id);
            const FollowingResponse = await FollowingDAO.removeFollowingFromUserWithID(user_id, other_user_id);
            
            res.json({status : "success"}); //

            console.log("Follower Response: " + FollowerResponse + "\n"); //
            console.log("Following Response: " + FollowingResponse + "\n"); //
        }
        catch(e) {
            res.status(500).json({error : e.message}); //
        }
    }

    static async apiIsFollowing(req,res,next) {

        try{
            const user_id= req.body.user_id;
            const other_user_id = req.body.other_user_id;
            console.log(user_id); //
            const FollowingResponse = await FollowingDAO.isUserFollowingOtherUserWithID(user_id, other_user_id);
            
            res.json(FollowingResponse); //

            console.log("Following Response: " + FollowingResponse + "\n"); //
            console.log(user_id + " to " + other_user_id);
        }
        catch(e) {
            res.status(500).json({error : e.message}); //
        }
    }

    static async apiReturnFollowerCount(req,res,next){
        try{
            const user_id= req.body.user_id;
            console.log(user_id); //

            const follow = await FollowerDAO.returnFollowerCountOfUserWithID(user_id);
            console.log("Response: " + follow + "\n"); //
            res.json(follow);
        }
        catch(e) {
            res.status(500).json({error : e.message}); //
        }
    }

    static async apiReturnFollowingCount(req,res,next){
        try{
            const user_id= req.body.user_id;
            console.log(user_id); //

            const follow = await FollowingDAO.returnFollowingCountOfUserWithID(user_id);
            console.log("Response: " + follow + "\n"); //
            res.json(follow);
        }
        catch(e) {
            res.status(500).json({error : e.message}); //
        }
    }

}