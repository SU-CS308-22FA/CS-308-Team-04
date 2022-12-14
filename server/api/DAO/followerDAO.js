const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let Follower;

module.exports =  class FollowerDAO{

    static async injectDB(conn){

        if (Follower){
            
            return;
        }

        try{

            Follower = await conn.db(process.env.ATLAS_DB).collection("followers");
        }

        catch(e){
            
            console.error("Unable to establish collection handles in FollowerDAO",e);
        }
    }

    static async addNewEntry(entry) {
        entry.user_id = ObjectId(entry.user_id); 
        try{

            return await Follower.insertOne(entry);    
        }
        catch(e){
            console.error("Unable to post entry",e);
            return {error:e};
        }
    }

    static async deleteEntry(user_id) {
        try{

            const deleteResponse = await Follower.deleteOne({user_id : ObjectId(user_id)});
            console.log(deleteResponse);    
        }
        catch(e){
            console.error("Unable to delete entry",e);
            return {error:e};
        }
    }

    static async addFollowerToOtherUserWithID(user_id, other_user_id) {
        let encoded1 = ObjectId(other_user_id); 
        try{

            await Follower.updateOne(
                {user_id: encoded1},
                {$addToSet: { "follower_list": ObjectId(user_id) },
                $inc : {
                    follower_count: 1,
                } }
            );
        }
        catch(e){
            
            console.log("Unable to add/update user in Follower",e);
            return {error:e};
        }
    }

    static async removeFollowerFromOtherUserWithID(user_id, other_user_id){
        try{

            await Follower.update(
                {user_id: ObjectId(other_user_id)},
                {$pull: { "follower_list": ObjectId(user_id) },
                $inc : {
                    follower_count: -1
                } }
            );
        }
        catch(e){

            console.log("Unable to add/update user in Follower",e);
            return {error:e};
        }
    }

    static async returnFollowerCountOfUserWithID (user_id) {
        try{

            return await Follower.findOne({
                user_id: ObjectId(user_id),
              },
              {projection:
                {follower_count: 1,
                _id: 0,}
              })
        }
        catch(e){

            console.log("Unable to return follower count",e);
            return {error:e};
        }
    }

    static async GetFollowerListOfUserWithID (user_id) {
        try{

            return await Follower.aggregate([
                {
                  "$match": {
                    "user_id": ObjectId(user_id)
                  }
                },
                {
                  "$lookup": {
                    "from": "users",
                    "localField": "follower_list",
                    "foreignField": "_id",
                    "as": "follower_list"
                  }
                },
                {
                  "$project": {
                    "follower_list._id": 1,
                    "follower_list.name": 1,
                    "follower_list.surname": 1,
                    "follower_list.username": 1
                  }
                }
              ]).toArray();
        }
        catch(e){

            console.log("Unable to return follower list",e);
            return {error:e};
        }
    }

}