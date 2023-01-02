import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { USE_LOCAL_BACKEND } from '../../config';
import Navbar from '../Navigation/navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import classes from "./DisplayConversations.module.css";


export default function AlignItemsList(props) {

    const location = useLocation();
    let navigate = useNavigate();
    const user_id = location.state.user_id;
    const userInfo = location.state.userInfo;
    const [userInfo2, setUserInfo2] = React.useState();
    const [reload, setReload] = React.useState(0);
    const [conversationsList, setConversationsList] = React.useState([]);


    /**
     * Determines if the specified message sender ID matches the current user's ID.
     *
     * @param {string} message_sender_id - The ID of the message sender.
     * @returns {boolean} - True if the message sender is the current user, false otherwise.
     */
    function isMe(message_sender_id) {
        let isTrue = message_sender_id === user_id ? true : false;
        return isTrue;
    }

    /**
     * Handles the click event for a conversation.
     * Determines the sender and receiver IDs for the conversation based on the current user's ID.
     * Navigates to the direct messages page and passes the sender, receiver, and current user's information as state.
     *
     * @param {Object} element - The conversation object.
     */
    const conversationClickHandler = (element) => {
        let user_info1_id = element.user_info1._id;
        let user_info2_id = element.user_info2._id;
        let is_sender_me = isMe(user_info1_id);
        let sender_id = "";
        let receiver_id = "";
        if (is_sender_me) {
            sender_id = user_info1_id;
            receiver_id = user_info2_id;
        }
        else {
            sender_id = user_info2_id;
            receiver_id = user_info1_id;
        }
        navigate("/DirectMessages", {
            state: {
                sender_id: sender_id,
                receiver_id: receiver_id,
                userInfo: userInfo
            },
        });
    }
    React.useEffect(() => {
        const interval = setInterval(() => {
            console.log("Conversations refreshed");
            if (reload === 1) {
                setReload(0);
            } else {
                setReload(1);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [reload]);

    React.useEffect(() => {
        fetch(
            USE_LOCAL_BACKEND
                ? `/GencFootball/dm/getAllConversationsforUser/${user_id}`
                : `https://genc-football-backend.herokuapp.com/GencFootball/dm/getAllConversationsforUser/${user_id}`
        )
            .catch((err) => {
                console.log("Caught error", err);
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setConversationsList(data);
                if (user_id === data[0].user_info1._id) {
                    setUserInfo2(data[0].user_info);
                }
                else {
                    setUserInfo2(data[0].user_info2);
                }
            })
    }, [reload])
    return (
        <>
            <Navbar className="Navbar" user={userInfo} />
            <div className={classes.Conversationsclass}>
                <h1>Conversations</h1>
                <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', marginBottom: "30%", marginTop: "2%" }}>
                    {conversationsList.map((element) => {
                        return (
                            <ListItem sx={{ cursor: "pointer" }} alignItems="flex-start" key={element._id} onClick={() => { conversationClickHandler(element) }}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={isMe(element.user_info1._id) ? element.user_info2.post_photo_url : element.user_info1.post_photo_url} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            {isMe(element.user_info1._id) ? element.user_info2.username : element.user_info1.username}
                                            <p style={{ marginLeft: 'auto' }}>{moment(element.date).format('YYYY MM DD HH:mm')}</p>
                                        </div>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                display="flex"
                                                flexDirection="row"
                                            >

                                            </Typography>

                                            <p>{element.last_message}</p>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </>
    );
}