import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Card from "../UI/Card/Card";
import classes from "../Profile/PostsList.module.css";
import { useNavigate } from "react-router-dom";
import { USE_LOCAL_BACKEND } from "../../config.js";
import emailjs from "@emailjs/browser";

export default function AlertDialog(props) {
  let navigate = useNavigate();
  emailjs.init("WKhaHGOHXG8Vd9o6q");
  const [open, setOpen] = React.useState(false);
  const [CommentContent, setCommentContent] = React.useState("");
  const [isValidComment, set_isValidComment] = React.useState(false);
  const [isButtonClicked, set_isButtonClicked] = React.useState(false);
  const [pageRefresher, setPageRefresher] = React.useState(0);
  const [CommentsList, setCommentsList] = React.useState([]);
  const post_id = props.post_id;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  const SendProfileHandler = (user_id) => {
    console.log(user_id);
    navigate("/Profile", {
      state: {
        user_id: user_id,
      },
    });
  };

  const CommentContentHandler = (event) => {
    setCommentContent(event.target.value);
  };

  const CommentSubmitHandler = (event) => {
    set_isButtonClicked(true);
    if (isValidComment) {
      props.onAddComment(props.element._id, CommentContent);
      setCommentContent("");
      setOpen(false);
    } else {
      console.log("Comment content should be valid");
    }
  };

  const ReportHandler = (ReportedID, ContentID) => {
    let user_id = localStorage.getItem("user");
    emailjs
      .send("service_mrjks8r", "template_2j2ce7o", {
        reporterID: user_id,
        reportedID: ReportedID,
        type: "Comment",
        contentID: ContentID,
      })
      .then(
        function (response) {
          console.log("Report: SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("Report: FAILED...", error);
        }
      );
  };

  React.useEffect(() => {
    set_isButtonClicked(false);
    if (CommentContent.trim().length === 0) {
      set_isValidComment(false);
    } else {
      set_isValidComment(true);
    }
  }, [CommentContent, isValidComment]);

  React.useEffect(() => {
    setPageRefresher(pageRefresher + 1);
  }, [isButtonClicked]);

  React.useEffect(() => {
    //posts/getcomments/:post_id
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/posts/getcomments/${post_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/posts/getcomments/${post_id}`
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => response.json())
      .then((data) => {
        setCommentsList(data);
      });
  }, [pageRefresher]);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ marginRight: "5px" }}
      >
        Comments
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"Share your Comment!"}
        </DialogTitle>
        <DialogContent>
          <div>
            {isButtonClicked && !isValidComment ? (
              <Alert severity="error">You can not send empty Comment!</Alert>
            ) : (
              ""
            )}
          </div>
          <TextField
            label=" Share Your comment!"
            size="small"
            variant="standard"
            fullWidth
            onChange={CommentContentHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={CommentSubmitHandler}>Share!</Button>
        </DialogActions>
        <DialogContent>
          <Card className={classes.post_card}>
            <div className={classes.post_header}>
              <button
                className={classes.post_info_button}
                onClick={() => SendProfileHandler(props.element.user_id)}
              >
                @{props.element.username}
              </button>
            </div>
            {isImage(props.element.post_photo_url) ? (
              <img
                className={classes.post_img}
                alt="Photo URL is not valid format"
                src={props.element.post_photo_url}
              />
            ) : null}

            <div className={classes.post_info}>
              <div className={classes.post_info_left}>
                <p className={classes.post_info_text}>
                  {props.element.post_message}
                </p>

                <div className={classes.react_buttons_div}>
                  <button
                    onClick={() => {
                      props.ReactionButtonHandler(props.element, 0);
                    }}
                    className={classes.react_buttons}
                  >
                    Like
                  </button>
                  <p className={classes.react_buttons_count}>
                    {
                      //Math.floor(Math.random() * 100)
                      props.element.reactions_list[0] //like index
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {CommentsList.map((element) => (
            <Card key={element._date} className={classes.post_card}>
              <div className={classes.post_header}>
                <button
                  className={classes.post_info_button}
                  //    onClick={() => SendProfileHandler(element.comment_info.user_id)}
                >
                  @{element.comment_info.username}
                </button>
              </div>
              <div className={classes.post_info}>
                <div className={classes.post_info_left}>
                  <p className={classes.post_info_text}>
                    {element.comments_list.comment_content}
                  </p>
                  <button
                    onClick={() => {
                      //console.log(element);
                      ReportHandler(element.user_id, element._id);
                    }}
                    className={classes.react_buttons}
                  >
                    Report
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
