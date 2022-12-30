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
import { useLocation } from 'react-router-dom';
import moment from 'moment';



export default function AlignItemsList(props) {

    const location = useLocation();
    const user_id = location.state.user_id;
    const userInfo = location.state.userInfo;
    const [userInfo2, setUserInfo2] = React.useState();
    const [conversationsList, setConversationsList] = React.useState([]);
    function isMe(message_sender_id) {
        let isTrue = message_sender_id === user_id ? true : false;
        return isTrue;
    }
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
    }, [])
    return (
        <>
            <Navbar className="Navbar" user={userInfo} />
            <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', marginBottom: "30%", marginTop: "2%" }}>
                {conversationsList.map((element) => {
                    return (
                        <ListItem alignItems="flex-start" key={element._id}>
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
        </>
    );
}