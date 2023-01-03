import { useEffect, useState } from "react";
import Navbar from "../Navigation/navbar";
import PostsList from "../Profile/PostsList";
import classes from "./Feed.module.css";
import { useLocation } from "react-router-dom";
import AddPost from "./AddPost";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { USE_LOCAL_BACKEND } from "../../config.js";

const Feed = (props) => {
  const [PostList, setPostList] = useState([]);
  const [PageNum, setPageNum] = useState(0);
  const [reload, setReload] = useState(0);
  const [ButtonClicker, set_ButtonClicker] = useState(0);
  const encodedValue = encodeURIComponent(PageNum);
  const location = useLocation();
  let user_id = location.state
    ? location.state.user_id
    : localStorage.getItem("user");

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Feed refreshed");
      if (reload === 1) {
        setReload(0);
      } else {
        setReload(1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [reload]);

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
    profiletype: "",
  });

  function isPersonal() {
    console.log(userInfo.profiletype)
    if (userInfo.profiletype == "Personal"){
      return true;
    }
    return false;
  }
  const AddPostHandler = async (enteredText, enteredURL) => {
    console.log(enteredText);
    console.log(enteredURL);
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/posts/add`
        : "https://genc-football-backend.herokuapp.com/GencFootball/posts/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          username: userInfo.username,
          post_message: enteredText,
          post_photo_url: enteredURL,
        }),
      }
    )
      .catch((error) => {
        window.alert(error);
      })
      .then((data) => {
        set_ButtonClicker(ButtonClicker + 1);
        console.log(ButtonClicker);
      });
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        USE_LOCAL_BACKEND
          ? `/GencFootball/user/${user_id}`
          : `https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
      }
      const user_fetch = await response.json();
      setUserInfo(user_fetch);
      console.log(user_fetch);
    }
    fetchData();
  }, [user_id]);

  useEffect(() => {
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/posts/getposts/${user_id}?page=${encodedValue}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/posts/getposts/${user_id}?page=${encodedValue}`
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => response.json())
      .then((data) => {
        setPostList(data.posts_list);
        //console.log(PostList)
      });
  }, [ButtonClicker, PageNum, reload, encodedValue]);

  const PreviosPageHandler = (event) => {
    event.preventDefault();
    setPageNum(PageNum - 1);
  };
  const NextPageHandler = (event) => {
    event.preventDefault();
    setPageNum(PageNum + 1);
  };

  const deleteHandler = async () => {
    if (reload === 1) {
      setReload(0);
    } else {
      setReload(1);
    }
  };

  return (
    <>
      <Navbar className="Navbar" user={userInfo} />
      {!isPersonal() ? (<AddPost onAddPost={AddPostHandler}></AddPost>) : null}
      
      <div className={classes.body}>
        <div className={classes.posts}>
          <PostsList onDelete={deleteHandler} list={PostList}></PostsList>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: "#aeb5b0",
              color: "white",
              "&:hover": {
                backgroundColor: "#00CD60",
                boxShadow: 2,
              },
              height: 45,
              marginTop: 1,
              marginRight: 2,
              boxShadow: 4,
            }}
            onClick={PreviosPageHandler}
          >
            Previous Posts
          </Button>
          <Button
            sx={{
              backgroundColor: "#aeb5b0",
              color: "white",
              "&:hover": {
                backgroundColor: "#00CD60",
                boxShadow: 2,
              },
              height: 45,
              marginTop: 1,
              boxShadow: 4,
            }}
            variant="contained"
            onClick={NextPageHandler}
            endIcon={<ArrowForwardIcon />}
          >
            Next Posts
          </Button>
        </div>
      </div>
    </>
  );
};

export default Feed;
