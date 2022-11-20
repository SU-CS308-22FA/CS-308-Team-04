import { useNavigate } from "react-router-dom";
import Card from "../UI/Card/Card";
import classes from "./PostsList.module.css";
const PostsList = (props) => {

  let navigate = useNavigate();

  const SendProfileHandler = (user_id) => {

      console.log(user_id);
      navigate("/Profile",{
        state: {
        user_id : user_id
        },
      });
  }
  return (
    <div className={classes.PostsList}>
      {props.list.map((element) => (
        <Card key={element._id} className={classes.post_card}>
          <img
            className={classes.post_img}
            alt="ronaldosiu"
            src="https://media.cnn.com/api/v1/images/stellar/prod/220119103641-ronaldo-siu-celebration.jpg"
          />
          <div className={classes.post_info}>

              <button className={classes.post_info_button}  onClick= {() => SendProfileHandler(element.user_id)}>@{element.username}</button>
              <p className={classes.post_info_text}>{element.post_message}</p>

            <div className={classes.react_buttons_div}>
              <button onClick={() => {window.alert("WIP")}} className={classes.react_buttons}>Like
              </button>
              <p className={classes.react_buttons_count}>
                {
                Math.floor(Math.random() * 100)
                //element.reactions_list[0]
                }
              </p>
              {/* TO ADD ALL THE REACTION ON A ARRAY DO THE SAME THING IN UPPER CODE */}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;
