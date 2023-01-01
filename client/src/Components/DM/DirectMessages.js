import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navigation/navbar";
import { USE_LOCAL_BACKEND } from "../../config";
import Card from "../UI/Card/Card";
import classes from "./DirectMessages.module.css";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { padding } from "@mui/system";

const DirectMessages = () => {
  const [dm_id, setDmId] = React.useState("");
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const my_user_id = location.state.sender_id;
  const other_userid = location.state.receiver_id;
  const [MessageContent, setMessageContent] = React.useState("");
  const [isValidMessage, set_isValidMessage] = React.useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [MyUserInfo, setMyUserInfo] = useState({
    name: "",
    surname: "",
    username: "",
    _id: ""
  });
  const [OtherUserInfo, setOtherUserInfo] = useState({
    name: "",
    surname: "",
    username: "",
    _id: ""
  });
  function isMyMessage(message_sender_id) {
    let isTrue = message_sender_id === my_user_id ? true : false;
    return isTrue;
  }

  const MessageContentHandler = (event) => {
    setMessageContent(event.target.value);
  }

  const MessageSendHandler = (event) => {
    if (isValidMessage) {     
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: localStorage.getItem("user"),
          message_content: MessageContent,
        }),
      }; 
      fetch(
        USE_LOCAL_BACKEND
          ? `/GencFootball/dm/sendMessage/${dm_id}`
          : `https://genc-football-backend.herokuapp.com/GencFootball/dm/sendMessage/${dm_id}`,
        requestOptions
      )
        .catch((err) => {
          console.log("Caught error", err);
        })
        .then((response) => response.json());
      
      setMessageContent("");
    }
    else {
      console.log("Message content should be valid");
    }
  }

  useEffect(() => {
    if (MessageContent.trim().length === 0) {
      set_isValidMessage(false);
    }
    else {
      set_isValidMessage(true);
    }
  }, [MessageContent, isValidMessage])

  useEffect(() => {
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/dm/getSpecificConversation/${my_user_id}/${other_userid}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/dm/getSpecificConversation/${my_user_id}/${other_userid}`
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => response.json())
      .then((data) => {
        //setPostList(data.posts_list);
        console.log("Data is", data);
        console.log("Direct Messages is1 ", data.direct_messages);
        setMessagesList(data.direct_messages);
        setDmId(data._id);
        //console.log("DM ID!!!!!:",dm_id);
        console.log("Direct Messages is2 ", messagesList);
        if (my_user_id === data.user_info1._id) {
          console.log("Yes they are equal");
          setMyUserInfo(data.user_info1);
          setOtherUserInfo(data.user_info2);
          console.log("OtherUserInfo is", OtherUserInfo);
        }
        else {
          setMyUserInfo(data.user_info2);
          setOtherUserInfo(data.user_info1);
        }
        //console.log("My user_info id is",myUserInfo._id);
      });
  }, [/*sendButtonClicker*/]);

  return (
    <>
      <Navbar className="Navbar" user={userInfo} />
      <Card className={classes.profile_bar}>
        <div className={classes.profile_img_divider}>
          <img
            className={classes.profile_logo}
            alt="cat"
            src={OtherUserInfo.post_photo_url}
          />
          <div className={classes.profile_info}>
            <h2 className={classes.h2}>
              {OtherUserInfo.name} {OtherUserInfo.surname}
            </h2>
            <h2 className={classes.h2}>@{OtherUserInfo.username}</h2>
          </div>
        </div>
      </Card>
      <div className={classes.messagesList}>
        {messagesList.map((element) => {
          return(
          <Card key={element.message_id} className={isMyMessage(element.sender_id) ? classes.message_card_right : classes.message_card_left}>
            <div className={classes.message_header}>
              <img
                className={classes.profile_logo}
                alt="cat"
                src={isMyMessage(element.sender_id) ? MyUserInfo.post_photo_url : OtherUserInfo.post_photo_url}
              />
              <p className={classes.message_info_text}>{element.message_content}</p>
            </div>
          </Card>
          );
        })}
      </div>
      <div className={classes.dm_message_send_bundle}>
        <div className={classes.dm_message_content_window}>
          <TextField
              label="Message content"
              id="Message-Content"
              size="small"
              variant="standard"
              fullWidth
              onChange={MessageContentHandler}
              value={MessageContent}
            />
        </div>
        <Button variant="contained" endIcon={<SendIcon/>} onClick={MessageSendHandler}>Send</Button>
      </div>

    </>
  );
}

export default DirectMessages;