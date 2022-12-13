import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";

let users = [];

function SimpleDialog(props) {
  const navigate = useNavigate();
  const { onClose, selectedValue, open, userlist } = props;

  users = userlist;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
    navigate("/Profile", {
      state: {
        user_id: value,
      },
    });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Users</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user) => (
          <ListItem button onClick={() => handleListItemClick(user._id)} key={user._id}>
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
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userlist: PropTypes.array.isRequired
};

export default SimpleDialog;