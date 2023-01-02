import React, {
  //useRef,
  useState,
  useEffect,
  //useReducer,
  //useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Profile.module.css";
import Card from "../UI/Card/Card";
import { USE_LOCAL_BACKEND } from "../../config.js";
import Navbar from "../Navigation/navbar";
import PostsList from "./PostsList";
import SimpleDialog from "./SimpleDialog";
//import FollowListDialog from "./FollowListDialog";
import Button from "@mui/material/Button";
import emailjs from "@emailjs/browser";
import MessageIcon from '@mui/icons-material/Message';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const Profile = (props) => {
  emailjs.init("WKhaHGOHXG8Vd9o6q");
  const location = useLocation();
  const navigate = useNavigate();
  const [reload, setReload] = useState(0);
  let user_id = location.state
    ? location.state.user_id
    : localStorage.getItem("user");

  const [userInfo, setUserInfo] = useState({
    _id: "",
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: "",
    isPrivate: "",
  });
  const [randomUsers, setRandomUsers] = useState([]);
  useEffect(() => {
    fetch(
        USE_LOCAL_BACKEND
            ? `/GencFootball/randomUsers`
            : `https://genc-football-backend.herokuapp.com/GencFootball/randomUsers`
    )
        .catch((err) => {
            console.log("Caught error", err);
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setRandomUsers(data);
            
        })
}, [])

function isSame() {
  console.log("isSame", user_id, localStorage.getItem("user"))
  let isSame = localStorage.getItem("user") === user_id ? true : false;
  console.log(isSame)
  return isSame;
}
const [userlist, setUserlist] = React.useState([]);

const [open, setOpen] = React.useState(false);

const handleClickOpenFollower = () => {
  setOpen(true);

  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/getFollowerList/${user_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowerList/${user_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      setUserlist(data[0].follower_list);
      console.log("Hello" + data[0].follower_list);
    });
};

const handleClickOpenFollowing = () => {
  setOpen(true);

  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/getFollowingList/${user_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowingList/${user_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      setUserlist(data[0].following_list);
      console.log("Hello" + data[0].following_list);
    });
};

const handleClose = (value) => {
  setOpen(false);
};

const [follower_count, setFollowerCount] = useState("Placeholder");
const [following_count, setFollowingCount] = useState("Placeholder");
const [isDisplayedProfileFollowed, setIsDisplayedProfileFollowed] =
  useState(false);

const [PostLists, setPostListsFunction] = useState([]);
useEffect(() => {
  async function fetchData() {
    const response = await fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/user/userwithpost/${user_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/user/userwithpost/${user_id}`
    );
    //console.log(response);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const user_fetch = await response.json();
    if (!user_fetch) {
      window.alert(`Record with id ${user_id} not found`);
      return;
    }
    setUserInfo(user_fetch);
    setPostListsFunction(user_fetch.posts);
  }
  fetchData();

  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/getFollowerCount/${user_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowerCount/${user_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      setFollowerCount(data.follower_count);
    });

  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/getFollowingCount/${user_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowingCount/${user_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      setFollowingCount(data.following_count);
    });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("user"),
      other_user_id: user_id,
    }),
  };
  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/isFollowing`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/isFollowing`,
    requestOptions
  )
    .catch((err) => {
      console.log("Caught error", err);
    })
    .then((response) => response.json())
    .then((data) => {
      setIsDisplayedProfileFollowed(data.isFollowing);
      //console.log("ISFOLLOWING:"+data.isFollowing)
    });

  return;
}, [user_id, reload]);

const ReportHandler = (ReportedID) => {
  let user_id = localStorage.getItem("user");
  emailjs
    .send("service_mrjks8r", "template_2j2ce7o", {
      reporterID: user_id,
      reportedID: ReportedID,
      type: "Profile",
      contentID: ReportedID,
    })
    .then(
      function (response) {
        alert("Reported Successfully.");
        console.log("Report: SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("Report: FAILED...", error);
        alert("Failed to report, try again later.");
      }
    );
};

const DirectMessageHandler = () => {
  let sender_id = localStorage.getItem("user");
  let receiver_id = user_id;
  console.log("Check conversation between", sender_id, "and", receiver_id);
  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/dm/checkconversation/${sender_id}/${receiver_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/dm/checkconversation/${sender_id}/${receiver_id}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("The response of get method is:", data);
      if (!data) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch(
          USE_LOCAL_BACKEND
            ? `/GencFootball/dm/createDm/${sender_id}/${receiver_id}`
            : `https://genc-football-backend.herokuapp.com/GencFootball/dm/createDm/${sender_id}/${receiver_id}`,
          requestOptions
        )
          .catch((err) => {
            console.log("Caught error", err);
          })
          .then((response) => response.json())
          .then((data) => {
            console.log("Conversation is created");
            navigate("/DirectMessages", {
              state: {
                sender_id: sender_id,
                receiver_id: receiver_id,
                userInfo: userInfo
              },
            });
          });
      }
      else {
        console.log("Conversation already exist");
        console.log("User info is: ", userInfo);
        navigate("/DirectMessages", {
          state: {
            sender_id: sender_id,
            receiver_id: receiver_id,
            userInfo: userInfo
          },
        });
      }
    });

}


const FollowUserHandler = (event) => {
  event.preventDefault();
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("user"),
      other_user_id: user_id,
    }),
  };
  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/addFollower`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/addFollower`,
    requestOptions
  )
    .catch((err) => {
      console.log("Caught error", err);
    })
    .then((response) => response.json());
  setFollowerCount(follower_count + 1);
  setIsDisplayedProfileFollowed(true);
};

const UnfollowUserHandler = (event) => {
  event.preventDefault();
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("user"),
      other_user_id: user_id,
    }),
  };
  fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/follow/removeFollower`
      : `https://genc-football-backend.herokuapp.com/GencFootball/follow/removeFollower`,
    requestOptions
  )
    .catch((err) => {
      console.log("Caught error", err);
    })
    .then((response) => response.json());
  setFollowerCount(follower_count - 1);
  setIsDisplayedProfileFollowed(false);
};

console.log(PostLists);
const DeleteUserHandler = async (event) => {
  event.preventDefault();
  await fetch(
    USE_LOCAL_BACKEND
      ? `/GencFootball/user/${user_id}`
      : `https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`,
    {
      method: "DELETE",
    }
  );
  window.alert("Your Account has been deleted");
  navigate("/Login");
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const deleteHandler = async () => {
  await sleep(100);
  if (reload === 1) {
    setReload(0);
  } else {
    setReload(1);
  }
};

const UpdateUserHandler = async (event) => {
  event.preventDefault();
  navigate("/UpdateProfile", {
    state: {
      userInfo: userInfo,
    },
  });
};
return (
  <>
    <Navbar className="Navbar" user={userInfo} />
    <Card className={classes.profile_bar}>
      <div className={classes.profile_img_divider}>
        <img
          className={classes.profile_logo}
          alt="cat"
          src={userInfo.post_photo_url}
        />
        <div className={classes.profile_info}>
          <h2 className={classes.h2}>
            {userInfo.name} {userInfo.surname}
          </h2>
          <h2 className={classes.h2}>@{userInfo.username}</h2>
        </div>
      </div>
      <div>
        <button
          className={classes.button}
          onClick={FollowUserHandler}
          hidden={
            user_id !== localStorage.getItem("user")
              ? isDisplayedProfileFollowed
                ? "hidden"
                : undefined
              : "hidden"
          }
        >
          Follow
        </button>
        <button
          className={classes.button}
          onClick={UnfollowUserHandler}
          hidden={
            user_id !== localStorage.getItem("user")
              ? isDisplayedProfileFollowed
                ? undefined
                : "hidden"
              : "hidden"
          }
        >
          Unfollow
        </button>
        <button
          onClick={() => {
            ReportHandler(user_id);
          }}
          hidden={
            user_id !== localStorage.getItem("user")
              ? isDisplayedProfileFollowed
                ? undefined
                : "hidden"
              : "hidden"
          }
          className={classes.button}
        >
          Report
        </button>
      </div>
      <div className={classes.profile_counts}>
        {!isSame() ? (<IconButton size="large" onClick={DirectMessageHandler}>
          <MessageIcon fontSize="large"></MessageIcon>
        </IconButton>) : null}
        <div
          className={classes.following_div}
          style={{ paddingRight: "10px" }}
        >
          <h2 className={classes.h2}>Followers</h2>
          <div>
            <Button variant="Text" onClick={handleClickOpenFollower}>
              {follower_count}
            </Button>
            <SimpleDialog
              open={open}
              onClose={handleClose}
              userlist={userlist}
            />
          </div>
        </div>
        <div className={classes.following_div}>
          <h2 className={classes.h2}>Following</h2>
          <div>
            <Button variant="Text" onClick={handleClickOpenFollowing}>
              {following_count}
            </Button>
            <SimpleDialog
              open={open}
              onClose={handleClose}
              userlist={userlist}
            />
          </div>
        </div>
      </div>
    </Card>
    <div className={classes.body}>
      {user_id === localStorage.getItem("user") ||
        !userInfo.isPrivate ||
        (userInfo.isPrivate && isDisplayedProfileFollowed) ? (
        <div className={classes.posts}>
          <div className={classes.post_title}>Your Posts:</div>
          <PostsList onDelete={deleteHandler} list={PostLists}></PostsList>
        </div>
      ) : (
        <div className={classes.posts}>
          <h1>Private profile</h1>
        </div>
      )}

      <div className={classes.right_bar}>
        <h1>Suggested Profiles</h1>
        <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', marginBottom: "30%", marginTop: "2%" }}>
          {randomUsers.map((element) => {
            return (
              <ListItem sx={{ cursor: "pointer" }} alignItems="flex-start" key={element._id} >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={element.post_photo_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {element.username}
                    </div>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </div>
    </div>
    <button className={classes.button} onClick={UpdateUserHandler}>
      Update
    </button>
    <button className={classes.button} onClick={DeleteUserHandler}>
      Delete
    </button>
  </>
);
};
export default Profile;
