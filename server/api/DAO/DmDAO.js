const mongodb = require("mongodb");
const { GetComments } = require("./postDAO");
const ObjectId = mongodb.ObjectId;

let Dm;

module.exports = class DmDAO {

    static async injectDB(conn) {
        if (Dm) {
            return;
        }
        try {

            Dm = await conn.db(process.env.ATLAS_DB).collection("DirectMessages");
        }

        catch (e) {

            console.error("Unable to establish collection handles in DmDAO", e);
        }
    }

    static async CreateMessageBetweenUsers(MessageInformations) {
        try {
            return await Dm.insertOne(MessageInformations);
        }
        catch (e) {
            console.log("Unable to add DirectMessages", e);
            return { error: e };
        }
    }

    static async SendMessageBetweenUsers(dm_id, MessageInformations) {
        try {
            const updateResponse = await Dm.updateOne(
                {
                    _id: ObjectId(dm_id)
                },
                {
                    $set: {
                        date: MessageInformations.date,
                        last_message: MessageInformations.message_content,
                    },
                    $push: {
                        direct_messages: MessageInformations
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
    static async isConversationExists(user1_id, user2_id) {
        try {
            const dbResponse = await Dm.countDocuments(
                {
                    users_list: {
                        $all: [user1_id, user2_id]
                    }
                }
            ) > 0;
            return dbResponse;
        }
        catch (e) {
            console.error(`Something went wrong in getUserPostsWithId: ${e}`)
            throw e
        }
    }

    static async GetSpecificConversation(user1_id, user2_id) {
        try {
            const pipeline = [
                {
                    "$match": {
                        users_list: {
                            "$all": [user1_id, user2_id]
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "users_list.0",
                        "foreignField": "_id",
                        "as": "user_info1"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "users_list.1",
                        "foreignField": "_id",
                        "as": "user_info2"
                    },

                },
                {
                    "$unwind": "$user_info1"
                },
                {
                    "$unwind": "$user_info2"
                },
                {
                    "$project": {
                        "user_info1.password": 0,
                        "user_info1.email": 0,
                        "user_info1.mobile_number": 0,
                        "user_info1.birth_date": 0,
                        "user_info1.date": 0,
                        "user_info1.isPrivate": 0,
                        "user_info1.profiletype": 0,
                    }
                },
                {
                    "$project": {
                        "user_info2.password": 0,
                        "user_info2.email": 0,
                        "user_info2.mobile_number": 0,
                        "user_info2.birth_date": 0,
                        "user_info2.date": 0,
                        "user_info2.isPrivate": 0,
                        "user_info2.profiletype": 0,
                    }
                }

            ]
            return await Dm.aggregate(pipeline).next();
        }
        catch (e) {
            console.log("Unable to Get Messages");
            return { error: e };
        }
    }

    static async GetAllConversationsforUser(user_id) {
        let cursor;
        try {
            cursor = await Dm.aggregate([
                {
                    "$match": {
                        users_list: {
                            "$in": [
                                ObjectId(user_id)
                            ]
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "users_list.0",
                        "foreignField": "_id",
                        "as": "user_info1"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "users_list.1",
                        "foreignField": "_id",
                        "as": "user_info2"
                    },
                },
                {
                    "$unwind": "$user_info1"
                },
                {
                    "$unwind": "$user_info2"
                },
                {
                    "$project": {
                        "user_info1.password": 0,
                        "user_info1.email": 0,
                        "user_info1.mobile_number": 0,
                        "user_info1.birth_date": 0,
                        "user_info1.date": 0,
                        "user_info1.isPrivate": 0,
                        "user_info1.profiletype": 0,
                    }
                },
                {
                    "$project": {
                        "user_info2.password": 0,
                        "user_info2.email": 0,
                        "user_info2.mobile_number": 0,
                        "user_info2.birth_date": 0,
                        "user_info2.date": 0,
                        "user_info2.isPrivate": 0,
                        "user_info2.profiletype": 0,
                    }
                },
                {
                    "$sort": {
                      date: -1
                    }
                  }

            ]);
        }
        catch (e) {
            console.log("Unable to Get Messages");
            return { error: e };
        }

        try{
            const ConversationsList = await cursor.toArray();
            console.log("Conversation List is ", ConversationsList);
            return ConversationsList;
        }
        catch (e) {
            console.error("Unable to convert cursor to array", e);
            return [];
        }
    }
}