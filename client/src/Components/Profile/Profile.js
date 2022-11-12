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

import Navbar from "../Navigation/navbar";
import PostsList from "./PostsList";

const Profile = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  let user_id = location.state.user_id;

  const [userInfo, setUserInfo] = useState({
    _id: "",
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: "",
  });

  const [PostLists,setPostListsFunction] = useState([]);
  useEffect(() => {
    async function fetchData() {
      //const response = await fetch(`/GencFootball/user/${user_id}`);
      const response = await fetch(
        `https://genc-football-backend.herokuapp.com/GencFootball/user/userwithpost/${user_id}`
        //`/GencFootball/user/userwithpost/${user_id}`
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
    return;
  }, [user_id]);

  console.log(PostLists);
  const DeleteUserHandler = async (event) => {
    event.preventDefault();
    await fetch(
      `https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`,
      //`/GencFootball/user/${user_id}`,
      {
        method: "DELETE",
      }
    );
    window.alert("Your Account has been deleted");
    navigate("/Login");
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
      <Navbar className="Navbar"/>
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
        <div className={classes.profile_counts}>
          <div
            className={classes.following_div}
            style={{ "paddingRight": "10px" }}
          >
            <h2 className={classes.h2}>Followers</h2>
            <p>31</p>
          </div>
          <div className={classes.following_div}>
            <h2 className={classes.h2}>Following</h2>
            <p>69</p>
          </div>
        </div>
      </Card>
      <div className={classes.body}>
        <div className={classes.posts}>
          <div className={classes.post_title}>Your Posts:</div>
          {/*<div className={classes.post_content}></div>*/}
          <PostsList list = {PostLists}></PostsList>
        </div>

        <div className={classes.right_bar}></div>
      </div >

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
