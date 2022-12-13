//import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./PostsList.module.css";
import { USE_LOCAL_BACKEND } from "../../config.js";
import AddComment from "../PopUps/AddComment";
import { useEffect } from "react";
import Emoji from "../UI/Card/Emoji";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';

const PostsList = (props) => {
  let navigate = useNavigate();


  const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
  }));

  const customIcons = {
    1: {
      icon: <Emoji label="Brick" symbol="🧱" />,
      label: 'Defence',
      index: 1,
    },
    2: {
      icon: <Emoji label="Gloves" symbol="🧤" />,
      label: 'Save',
      index: 2,
    },
    3: {
      icon: <Emoji label="Man sprinting" symbol="🏃‍♂‍" />,
      label: 'Speed',
      index: 3,
    },
    4: {
      icon: <Emoji label="Running shoe" symbol="👟" />,
      label: 'Dribble',
      index: 4,
    },
    5: {
      icon: <Emoji label="Goal net" symbol="🥅" />,
      label: 'Goal',
      index: 5,
    },
  };

  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };



  const SendProfileHandler = (user_id) => {
    console.log(user_id);
    navigate("/Profile", {
      state: {
        user_id: user_id,
      },
    });
  };

  const AddCommentHandler = (post_id, comment_content) => {
    const user_id = localStorage.getItem("user");
    console.log(user_id, post_id, comment_content);
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/posts/addcomment/${user_id}/${post_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/posts/addcomment/${user_id}/${post_id}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            comment_content: comment_content,
          }
        ),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    })
      .then((response) => {
        //success
        console.log(response);
        //reload feed
      })
  }


  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  const likePostHandler = (element, indexReaction) => {
    let updated_reaction_list = element.reactions_list;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reactedby_id: localStorage.getItem("user"),
        reacted_index: indexReaction, //like button index 0, reactions indexes: 1,2,3,4
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
          {isImage(element.post_photo_url) ? (
            <img
              className={classes.post_img}
              alt="Photo URL is not valid format"
              src={element.post_photo_url}
            />
          ) : null}

          <div className={classes.post_info}>
            <div className={classes.post_info_left}>
              <p className={classes.post_info_text}>{element.post_message}</p>

              <div className={classes.react_buttons_div}>
                <button
                  onClick={() => {
                    likePostHandler(element,0);
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
                <button
                  onClick={() => {
                    likePostHandler(element,1);
                  }}
                  className={classes.react_buttons}
                >
                 <Emoji label="Brick" symbol="🧱" />
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[1] //like index
                  }
                </p>
                <button
                  onClick={() => {
                    likePostHandler(element,2);
                  }}
                  className={classes.react_buttons}
                >
                  <Emoji label="Gloves" symbol="🧤" />
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[2] //like index
                  }
                </p>
                <button
                  onClick={() => {
                    likePostHandler(element,3);
                  }}
                  className={classes.react_buttons}
                >
                  <Emoji label="Man sprinting" symbol="🏃‍♂‍" />
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[3] //like index
                  }
                </p>
                <button
                  onClick={() => {
                    likePostHandler(element,4);
                  }}
                  className={classes.react_buttons}
                >
                  <Emoji label="Running shoe" symbol="👟" />
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[4] //like index
                  }
                </p>
                <button
                  onClick={() => {
                    likePostHandler(element,5);
                  }}
                  className={classes.react_buttons}
                >
                  <Emoji label="Goal net" symbol="🥅" />
                </button>
                <p className={classes.react_buttons_count}>
                  {
                    //Math.floor(Math.random() * 100)
                    element.reactions_list[5] //like index
                  }
                </p>
                {/* TO ADD ALL THE REACTION ON A ARRAY DO THE SAME THING IN UPPER CODE */}
              </div>
            </div>
            <div className={classes.post_info_right}>
              <AddComment post_id={element._id} ReactionButtonHandler={likePostHandler} element={element} onAddComment={AddCommentHandler}></AddComment>
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
