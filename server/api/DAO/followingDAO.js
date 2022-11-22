const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let Following;

module.exports =  class FollowingDAO{

    static async injectDB(conn){

        if (Following){
            
            return;
        }

        try{

            Following = await conn.db(process.env.ATLAS_DB).collection("followings");
        }

        catch(e){
            
            console.error("Unable to establish collection handles in FollowingDAO",e);
        }
    }

    static async addNewEntry(entry) {
        entry.user_id = ObjectId(entry.user_id); 
        try{

            return await Following.insertOne(entry);    
        }
        catch(e){
            console.error("Unable to post entry",e);
            return {error:e};
        }
    }

    static async deleteEntry(user_id) {
        try{

            const deleteResponse = await Following.deleteOne({user_id : ObjectId(user_id)});
            console.log(deleteResponse);    
        }
        catch(e){
            console.error("Unable to delete entry",e);
            return {error:e};
        }
    }

    static async isUserFollowingOtherUserWithID(user_id, other_user_id){
        try{
            /*const pipeline = [
                {$match: {user_id : ObjectId(user_id)}},
                {$project: {isFollowing : {$setIsSubset: [[ObjectId(other_user_id)], "$following_list"]}}}
            ];*/

            //return await Following.aggregate(pipeline).next();

            return await Following.findOne(
                {user_id : ObjectId(user_id)},
                {projection : {isFollowing: {$in: [ObjectId(other_user_id), "$following_list"]}, _id : 0},
                }
            );
        }
        catch(e){

            console.log("Unable to check isFollowing",e);
            return {error:e};
        }
    }

    static async addFollowingToUserWithID(user_id, other_user_id){
        try{

            await Following.update(
                {user_id: ObjectId(user_id)},
                {$addToSet: { "following_list": ObjectId(other_user_id) }, // BU DORU GİBİ
                $inc : {
                    following_count: 1 // OLDU
                } }
            );
        }
        catch(e){

            console.log("Unable to add/update user in Following",e);
            return {error:e};
        }
    }

    static async removeFollowingFromUserWithID(user_id, other_user_id){
        try{

            await Following.update(
                {user_id: ObjectId(user_id)},
                {$pull: { "following_list": ObjectId(other_user_id) },
                $inc : {
                    following_count: -1
                } }
            );
        }
        catch(e){

            console.log("Unable to add/update user in Following",e);
            return {error:e};
        }
    }

    static async returnFollowingCountOfUserWithID (user_id) {
        try{

            return await Following.findOne({
                user_id: ObjectId(user_id),
              },
              {projection:
                {following_count: 1,
                _id: 0,}
              })
        }
        catch(e){

            console.log("Unable to return following count",e);
            return {error:e};
        }
    }
        
}