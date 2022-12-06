const mongodb = require("mongodb");
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
                        isPrivate : updated_user.isPrivate
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
}