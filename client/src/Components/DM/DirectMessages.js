import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navigation/navbar";
import { USE_LOCAL_BACKEND } from "../../config";
import Card from "../UI/Card/Card";
import classes from "./DirectMessages.module.css";
const DirectMessages = () => {
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const my_user_id = location.state.sender_id;
  const other_userid = location.state.receiver_id;
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
    </>
  );
}

export default DirectMessages;
