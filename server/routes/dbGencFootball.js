const express = require("express");
const UserCtrl = require("../api/Controller/UserController.js")
const PostCtrl = require("../api/Controller/PostController.js")
const FollowCtrl = require("../api/Controller/FollowController.js");
const DmController = require("../api/Controller/DmController.js");
//const { addFollowerToOtherUserWithID } = require("../api/DAO/followerDAO.js");
const router = express.Router();

//router.route("/").get((req,res) => res.send("hello world"));

//ROUTERS OF USER TABLE
router.route("/user/add").post(UserCtrl.apiPostUser);
router.route("/user/:user_id").get(UserCtrl.apiGetSpecificUser);
router.route("/user/:user_id").put(UserCtrl.apiUpdateUser);
router.route("/user/:user_id").delete(UserCtrl.apiDeleteUser);
router.route("/users/:email").get(UserCtrl.apiGetUserByEmail);
router.route("/user/userwithpost/:user_id").get(UserCtrl.apiGetUserWithPost);
router.route("/user/isPrivate/:user_id").get(UserCtrl.apiIsUserPrivate);
router.route("/user/userwithquery/:user_info").get(UserCtrl.apiGetUserWithQuery);
router.route("/randomUsers").get(UserCtrl.apiGetRandomUsers);

//ROUTERS OF VIEW TABLE
router.route("/posts/add").post(PostCtrl.apiPostPosts);
router.route("/posts/:post_id").put(PostCtrl.apiUpdatePost);
router.route("/posts/getposts/:user_id").get(PostCtrl.apiGetPosts);
router.route("/posts/postreaction/:post_id").put(PostCtrl.apiUpdatePostReaction);
router.route("/posts/deleteposts").delete(PostCtrl.apiDeletePosts);
router.route("/posts/addcomment/:user_id/:post_id").put(PostCtrl.apiAddComment);
router.route("/posts/getcomments/:post_id").get(PostCtrl.apiGetComments);

//ROUTERS OF FOLLOWER & FOLLOWING TABLE
router.route("/follow/addFollower").put(FollowCtrl.apiAddFollowerAndUpdateCounts); // "/follow/addFollower/:user_id"
router.route("/follow/removeFollower").put(FollowCtrl.apiRemoveFollowerAndUpdateCounts); // "/follow/removeFollower/:user_id"
router.route("/follow/registerFollow").post(FollowCtrl.apiRegisterUserToFollowTable); // OK
router.route("/follow/unregisterFollow").delete(FollowCtrl.apiDeleteUserFromFollowTable); // "/follow/unregisterFollow/:user_id" // OK
router.route("/follow/getFollowerCount/:user_id").get(FollowCtrl.apiReturnFollowerCount); // "/follow/getFollowerCount/:user_id" // OK
router.route("/follow/getFollowingCount/:user_id").get(FollowCtrl.apiReturnFollowingCount); // "follow/getFollowingCount/:user_id" // OK
router.route("/follow/getFollowerList/:user_id").get(FollowCtrl.apiGetFollowerList);
router.route("/follow/getFollowingList/:user_id").get(FollowCtrl.apiGetFollowingList);
router.route("/follow/isFollowing").post(FollowCtrl.apiIsFollowing); // OK !!!!!!!!!!

//ROUTERS OF DirectMessage TABLE
router.route("/dm/createDm/:user1_id/:user2_id").post(DmController.apiCreateMessageBetweenUsers);
router.route("/dm/sendMessage/:dm_id").put(DmController.apiSendMessageBetweenUsers);
router.route("/dm/checkconversation/:user1_id/:user2_id").get(DmController.apiisConversationExists);
router.route("/dm/getSpecificConversation/:user1_id/:user2_id").get(DmController.apiGetSpecificConversation);
router.route("/dm/getAllConversationsforUser/:user_id").get(DmController.apiGetAllConversationsforUser);
module.exports = router;