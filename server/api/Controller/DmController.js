const DmDAO = require("../DAO/DmDAO.js");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
module.exports = class DmController {

    static async apiCreateMessageBetweenUsers(req, res, next) {
        try {
            let user1_id = ObjectId(req.params.user1_id);
            let user2_id = ObjectId(req.params.user2_id);

            const MessageInformations = {
                users_list : [user1_id,user2_id],
                date: new Date(),
                last_message: "",
                direct_messages: [],
            }

            let UserdbResponse = await DmDAO.CreateMessageBetweenUsers(MessageInformations);
            res.json(UserdbResponse);
        }
        catch (e) {

            res.status(500).json({ error: e.message });
        }

    }

    static async apiSendMessageBetweenUsers(req, res, next) {
        try {
            let dm_id = req.params.dm_id;
            const MessageInformations = {
                message_id : new ObjectId(),
                sender_id: ObjectId(req.body.sender_id),
                date: new Date(),
                message_content: req.body.message_content
            }
            let UserdbResponse = await DmDAO.SendMessageBetweenUsers(dm_id,MessageInformations);
            res.json(UserdbResponse);
        }
        catch (e) {

            res.status(500).json({ error: e.message });
        }
    }

    static async apiisConversationExists(req,res,next){
        try {
            let user1_id = ObjectId(req.params.user1_id);
            let user2_id = ObjectId(req.params.user2_id);
            let UserdbResponse = await DmDAO.isConversationExists(user1_id,user2_id);
            res.json(UserdbResponse);
        }
        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }

    static async apiGetSpecificConversation(req,res,next){
        try{
            let user1_id = ObjectId(req.params.user1_id);
            let user2_id = ObjectId(req.params.user2_id);
            let UserdbResponse = await DmDAO.GetSpecificConversation(user1_id,user2_id);
            res.json(UserdbResponse);
        }
        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }

    static async apiGetAllConversationsforUser(req,res,next){
        try{
            let user_id = ObjectId(req.params.user_id);
            let UserdbResponse = await DmDAO.GetAllConversationsforUser(user_id);
            res.json(UserdbResponse);
        }
        catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }
}