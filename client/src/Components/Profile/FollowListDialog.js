import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const SendProfileHandler = (user_id) => {
  setOpen(false);
  console.log(user_id);
  navigate("/Profile", {
    state: {
      user_id: user_id,
    },
  });
};

const [users, setUsers] = React.useState([]);

const [open, setOpen] = React.useState(false);

const handleClickOpen = () => {
  setOpen(true);

  if(type == "follower"){
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/follow/getFollowerList/${user_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowerList/${user_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data[0].follower_list);
        console.log("Hello" + data[0].follower_list);
      });
  }
  if(type == "following"){
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/follow/getFollowingList/${user_id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/follow/getFollowingList/${user_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data[0].following_list);
        console.log("Hello" + data[0].following_list);
      });
  }
};

function FollowListDialog(props) {
  const { onClose, selectedValue } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{props.children}</DialogTitle>
        <List sx={{ pt: 0 }}>
          {users.map((user) => (
            <ListItem
              button
              onClick={() => SendProfileHandler(user._id)}
              key={user._id}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

FollowListDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  //selectedValue: PropTypes.string.isRequired,
  userlist: PropTypes.array.isRequired,
  //followCount: PropTypes.number.isRequired
};

export default FollowListDialog;

/*export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button variant="Text" onClick={handleClickOpen}>
        follower_count
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};*/
