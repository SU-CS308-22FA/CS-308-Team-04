const express = require("express");
const UserCtrl = require("../api/Controller/UserController.js")
const router = express.Router();

//router.route("/").get((req,res) => res.send("hello world"));

router.route("/user/add").post(UserCtrl.apiPostUser);
router.route("/user/:user_id").get(UserCtrl.apiGetSpecificUser);
router.route("/user/:user_id").put(UserCtrl.apiUpdateUser);
router.route("/user/:user_id").delete(UserCtrl.apiDeleteUser);
router.route("/users/:email").get(UserCtrl.apiGetUserByEmail);

module.exports = router;
