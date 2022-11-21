const express = require("express");
const app = express();
const cors = require("cors");
mongodb = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const dbGencFootball= require("./routes/dbGencFootball.js");
const UserDAO = require("./api/DAO/userDAO.js");
const PostDAO = require("./api/DAO/postDAO.js");
const FollowerDAO = require("./api/DAO/followerDAO.js");
const FollowingDAO = require("./api/DAO/followingDAO.js");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/GencFootball",dbGencFootball);
// get driver connection
//const dbo = require("./db/conn");
 
//app.listen(port, () => {
  // perform a database connection when server starts
  ////if (err) console.error(err);
 
//  });
  //console.log(`Server is running on port: ${port}`);
//});
const MongoClient = mongodb.MongoClient


MongoClient.connect(
  process.env.ATLAS_URI,

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
).catch(err => {
    console.error(err.stack),
    process.exit(1)
}).then(async client => {
    await PostDAO.injectDB(client),
    await UserDAO.injectDB(client),
    await FollowerDAO.injectDB(client),
    await FollowingDAO.injectDB(client),
    app.listen(port,() => {
        console.log("Listening on port ",port);
    })
})