//import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./PostsList.module.css";
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
    updated_reaction_list[0] += 1;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: element.user_id,
        username: element.username,
        post_message: element.post_message,
        comments_list: element.comments_list,
        comments_count: element.comments_count,
        reactions_list: updated_reaction_list,
        share_count: element.share_count,
        date: element.date,
      }),
    };
    fetch(
      `https://genc-football-backend.herokuapp.com/GencFootball/posts/${element._id}`,
      requestOptions
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => response.json());
    props.onDelete();
  };

  const deletePostHandler = (element) => {
    console.log(element.user_id, element._id);
    const encodedValue1 = encodeURIComponent(element.user_id);
    const encodedValue2 = encodeURIComponent(element._id);
    fetch(
      `https://genc-football-backend.herokuapp.com/GencFootball/posts/deleteposts?user_id=${encodedValue1}&post_id=${encodedValue2}`,
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
            alt="lorem picsum"
            src={`https://picsum.photos/1000/450?random=${Math.floor(
              Math.random() * 20
            )}`}
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
                    element.reactions_list[0]
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
