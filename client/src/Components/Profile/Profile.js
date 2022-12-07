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
//import FollowListDialog from "./FollowListDialog";
/////
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
/////

const Profile = (props) => {
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

  /////Used for Follow List Dialog
  const SendProfileHandler = (user_id) => {
    setOpen(false);
    console.log(user_id);
    navigate("/Profile", {
      state: {
        user_id: user_id,
      },
    });
  };

  const [followers, setFollowers] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);

    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/follow/getFollowerList/${user_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowerList/${user_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data[0].follower_list);
        console.log("Hello" + data[0].follower_list);
      });
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  //////////////

  const [follower_count, setFollowerCount] = useState("Placeholder");
  const [following_count, setFollowingCount] = useState("Placeholder");

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

    return;
  }, [user_id, reload]);

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
            src="https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&w=1080&fit=max&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
          />
          <div className={classes.profile_info}>
            <h2 className={classes.h2}>
              {userInfo.name} {userInfo.surname}
            </h2>
            <h2 className={classes.h2}>@{userInfo.username}</h2>
          </div>
        </div>
        <button className={classes.button} onClick={FollowUserHandler}>
          Follow
        </button>
        <button className={classes.button} onClick={UnfollowUserHandler}>
          Unfollow
        </button>
        <div className={classes.profile_counts}>
          <div
            className={classes.following_div}
            style={{ paddingRight: "10px" }}
          >
            <h2 className={classes.h2}>Followers</h2>
            <div> {/* replace this div if possible and make a separate component*/}
            <Button variant="Text" onClick={handleClickOpen}>{follower_count}</Button> 
              <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Followers</DialogTitle>
                <List sx={{ pt: 0 }}>
                  {followers.map((follower) => (
                    <ListItem
                      button
                      onClick={() => SendProfileHandler(follower._id)}
                      key={follower._id}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={follower.username} />
                    </ListItem>
                  ))}
                </List>
              </Dialog>
            </div>
          </div>
          <div className={classes.following_div}>
            <h2 className={classes.h2}>Following</h2>
            <p>{following_count}</p>
          </div>
        </div>
      </Card>
      <div className={classes.body}>
        <div className={classes.posts}>
          {!(user_id != localStorage.getItem("user") && userInfo.isPrivate) ? (
            <div>
              <div className={classes.post_title}>Your Posts:</div>
              {/*<div className={classes.post_content}></div>*/}
              <PostsList onDelete={deleteHandler} list={PostLists}></PostsList>
            </div>
          ) : (
            <h1>Private profile</h1>
          )}
        </div>

        <div className={classes.right_bar}></div>
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
