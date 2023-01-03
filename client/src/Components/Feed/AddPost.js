import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';

export default function AddPost(props) {
  const [open, setOpen] = React.useState(false);
  const [PostContent, setPostContent] = React.useState("");
  const [PostURL, setPostURL] = React.useState("");
  const [isValidPost, set_isValidPost] = React.useState(false);
  const [isButtonClicked, set_isButtonClicked] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {

    set_isButtonClicked(false);
    //PostContent.trim().length == 0 ? console.log("It can not be empty")&&set_isValidPost(false) :  set_isValidPost(true);
    if (PostContent.trim().length === 0) {
      set_isValidPost(false);
    }
    else {
      set_isValidPost(true);
    }
    //console.log(PostContent);
    // console.log(PostContent.trim().length);
    //console.log(isValidPost);

  }, [PostContent, isValidPost])
  const PostContentHandler = (event) => {
    setPostContent(event.target.value);
  }

  const PostURLHandler = (event) => {
    setPostURL(event.target.value);
  }

  const PostSubmitHandler = (event) => {
    //console.log(PostContent.trim().length);
    //PostContent.trim().length === 0 ? set_isValidPost(true) :  set_isValidPost(false);
    // isValidPost ? setOpen(false) : console.log("Post content should be valid");
    set_isButtonClicked(true);
    if (isValidPost) {
      props.onAddPost(PostContent,PostURL);
      setPostContent("");
      setPostURL("");
      setOpen(false);
    }
    else {
      console.log("Post content should be valid");
    }
  }


  return (
    <div>
      <Fab size="small" color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Your Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <TextField
            label="Photo URL"
            id="Photo-Id"
            size="small"
            variant="standard"
            fullWidth
            onChange={PostURLHandler}
          />
          <div>{isButtonClicked && !isValidPost ? <Alert severity="error">You can not send empty post!</Alert> : ""}</div>
          <TextField
            label="Post Content"
            id="Post-Content"
            size="small"
            variant="standard"
            fullWidth
            onChange={PostContentHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={PostSubmitHandler}>Share!</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}