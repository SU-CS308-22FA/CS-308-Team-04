//import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./PostsList.module.css";
import { USE_LOCAL_BACKEND } from "../../config.js";
import { useEffect } from "react";
const PostsList = (props) => {
  let navigate = useNavigate();

  const SendProfileHandler = (user_id) => {
    console.log(user_id);
    navigate("/Profile", {
      state: {
        user_id: user_id,
      },
    });
  };

  const likePostHandler = (element) => {
    let updated_reaction_list = element.reactions_list;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reactedby_id: localStorage.getItem("user"),
        reacted_index: 0, //like button index 0, reactions indexes: 1,2,3,4
      }),
    };
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/posts/postreaction/${element._id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/posts/postreaction/${element._id}`,
      requestOptions
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => {
        response.json();
        props.onDelete();
      });
  };

  const deletePostHandler = (element) => {
    console.log(element.user_id, element._id);
    const encodedValue1 = encodeURIComponent(element.user_id);
    const encodedValue2 = encodeURIComponent(element._id);
    fetch(
      USE_LOCAL_BACKEND
        ? `GencFootball/posts/deleteposts?user_id=${encodedValue1}&post_id=${encodedValue2}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/posts/deleteposts?user_id=${encodedValue1}&post_id=${encodedValue2}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .catch((error) => {
        window.alert(error);
      })
      .then((data) => {
        console.log(data.json());
        props.onDelete();
      });
  };

  return (
    <div className={classes.PostsList}>
      {props.list.map((element) => (
        <Card key={element._id} className={classes.post_card}>
          <div className={classes.post_header}>
            <button
              className={classes.post_info_button}
              onClick={() => SendProfileHandler(element.user_id)}
            >
              @{element.username}
            </button>
          </div>

          <img
            className={classes.post_img}
            alt="Photo URL is not valid"
            src={element.post_photo_url}
          />
          <div className={classes.post_info}>
            <div className={classes.post_info_left}>
              <p className={classes.post_info_text}>{element.post_message}</p>

              <div className={classes.react_buttons_div}>
                <button
                  onClick={() => {
                    likePostHandler(element);
                  }}
                  className={classes.react_buttons}
                >
                  Like
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[0] //like index
                  }
                </p>

                {/* TO ADD ALL THE REACTION ON A ARRAY DO THE SAME THING IN UPPER CODE */}
              </div>
            </div>
            <div className={classes.post_info_right}>
              <button
                onClick={() => {
                  deletePostHandler(element);
                }}
                className={classes.react_buttons}
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;
