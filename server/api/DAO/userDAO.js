const mongodb = require("mongodb");
const { search } = require("../../routes/dbGencFootball");
const ObjectId = mongodb.ObjectId;

let User;

module.exports =  class UserDAO{

        static async injectDB(conn){

            if (User){
                
                return;
            }

            try{

                User = await conn.db(process.env.ATLAS_DB).collection("users");
            }

            catch(e){
                
                console.error("Unable to establish collection handles in UserDAO",e);
            }
        }

        static async addUser(user){

            try{

                return await User.insertOne(user);    
            }
            catch(e){
                console.error("Unable to post User",e);
                return {error:e};
            }
        }

        static async getoneUserById(user_id){
            try{
                return await User.findOne({_id : ObjectId(user_id)});
            }
            catch(e){
                console.log("Unable to Get User",e);
                return {error:e};
            }
        }

        static async getRandomUsers(){
            let cursor;
            try{
                cursor = await User.aggregate([
                    {
                        $sample: {size: 6}
                    }
                ]).toArray();
                return cursor;
            }
            catch(e){
                console.log("Unable to Get Users",e);
                return [];
            }
        }

        static async getQueryUserList(user_info){
            
            //let query;
            //query =  {$text: {$search : user_info}};
            let cursor;
            try{
                cursor = await User.find({ $or:[{
                    name: {
                        $regex: new RegExp(user_info),$options : "i"
                    }},
                    {
                    username: {
                        $regex: new RegExp(user_info),$options : "i"
                    }}]
                },
                );
            }
            catch(er){

                console.error("Unable to find issue find command ", er);
                return {UsersList : []};
            }
            let list_num = 5;
            const displayCursor = cursor.limit(list_num);
            try{

                const UsersList = await displayCursor.toArray();
                return UsersList;
            }
            catch(er){

                console.error("Unable to find issue find command ", er);
                return {UsersList : []};
            }
        }

        static async getUserPostsWithId(user_id){

            console.log(user_id);

            try {
                const pipeline = [
                  {
                      $match: {
                          _id: new ObjectId(user_id),
                      },
                  },
                        {
                            $lookup: {
                                from: "posts",
                                let: {
                                    id: "$_id",
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$user_id", "$$id"],
                                            },
                                        },
                                    },
                                    {
                                        $sort: {
                                            date: -1,
                                        },
                                    },
                                ],
                                as: "posts",
                            },
                        },
                        {
                            $addFields: {
                                posts: "$posts",
                            },
                        },
                    ]
                return await User.aggregate(pipeline).next()
              } catch (e) {
                console.error(`Something went wrong in getUserPostsWithId: ${e}`)
                throw e
              }
        }

        static async getoneUserByEmail(user_email){
            try{

                return await User.findOne({email : user_email});
            }

            catch(e){

                console.log("Unable to Get User",e);
                return {error:e};
            }
        }

        static async updateUser(user_id,updated_user){
            try{
                const updateResponse = await User.updateOne(

                    {_id : ObjectId(user_id)},
                    {$set : {
                        username : updated_user.username,
                        password : updated_user.password,
                        name : updated_user.name,
                        surname : updated_user.surname,
                        email : updated_user.email,
                        mobile_number : updated_user.mobile_number,
                        birth_date : updated_user.birth_date,
                        date : updated_user.date,
                        post_photo_url : updated_user.post_photo_url,
                        isPrivate : updated_user.isPrivate,
                        profiletype : updated_user.profiletype,
                        
                    }}
                );

                return updateResponse;
            }
            catch(e){
                console.log("Unable to Update Review");
                return {error:e};
            }

        }

        static async deleteUser(user_id){
            
            try{
                const deleteResponse = await User.deleteOne({_id : ObjectId(user_id)});
                console.log(deleteResponse);
                return deleteResponse;
            }

            catch(e){
                console.log("Unable to delete reviews",e);
                return {error:e};
            }
        }

        static async isUserPrivate(user_id){
            
            try{
                return await User.findOne({
                    _id : ObjectId(user_id),
                    isPrivate: true
                  },
                  {projection:
                    {isPrivate: 1,
                    _id: 0,}
                  }
                  )
            }

            catch(e){
                console.log("Unable to delete reviews",e);
                return {error:e};
            }
        }

}