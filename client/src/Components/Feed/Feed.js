import { useEffect, useState } from "react";
import Navbar from "../Navigation/navbar";
import PostsList from "../Profile/PostsList";
import classes from "./Feed.module.css"
import { useLocation } from "react-router-dom";
import AddPost from "./AddPost";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Feed = (props) => {

    const [PostList,setPostList] = useState([]);
    const [PageNum,setPageNum] = useState(0);
    const [ButtonClicker,set_ButtonClicker] = useState(0);
    const encodedValue = encodeURIComponent(PageNum);
    const location = useLocation();

    let user_id = location.state.user_id;
    const [userInfo,setUserInfo] = useState({

        username : "",
        name : "",   
    });

    const AddPostHandler = async (enteredText) => {
        console.log(enteredText);
        fetch(
          "https://genc-football-backend.herokuapp.com/GencFootball/posts/add"
        //`/GencFootball/posts/add`
        ,{
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                user_id : user_id,
                username : userInfo.username,
                post_message : enteredText
            }),
        }
        ).catch((error) => {
            window.alert(error);
        })
        .then(data => {
            set_ButtonClicker(ButtonClicker+1);
            console.log(ButtonClicker);
        });
    }

    useEffect( () => {

        async function fetchData(){
        const response = await fetch(
            `https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`
            // `/GencFootball/user/${user_id}`
            );
        if(!response.ok){
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
        }
        const user_fetch = await response.json();
        setUserInfo({username : user_fetch.username, name : user_fetch.name});
    }
     fetchData();
    },[]);  
    
    useEffect(() => {
        fetch(
            `https://genc-football-backend.herokuapp.com/GencFootball/posts/getposts?page=${encodedValue}`
           // `/GencFootball/posts/getposts?page=${encodedValue}`
            )
        .catch(err => {
            console.log("Caught error",err);
        })
        .then(response => response.json())
        .then(data =>{ 
            setPostList(data.posts_list);
            //console.log(PostList)
        })
    },[ButtonClicker,PageNum]);
 
    const PreviosPageHandler = (event) => {
        event.preventDefault();
        setPageNum(PageNum-1);
    }
    const NextPageHandler = (event) => {
        event.preventDefault();
        setPageNum(PageNum+1);
    }

    return(
        <>
        <Navbar className="Navbar"/>
        <AddPost onAddPost = {AddPostHandler}></AddPost>
        <div className= {classes.body}>
        <div className= {classes.posts}>
        <PostsList list = {PostList}></PostsList>
        <Button 
        variant="contained" 
        startIcon={<ArrowBackIcon />}
        sx={{
            backgroundColor: '#aeb5b0',
            color: 'white',
            '&:hover': {
              backgroundColor:'#00CD60',
              boxShadow:2,
            },
            height: 45,
            marginTop:1,
            marginRight:2,
            boxShadow:4,
          }}
        onClick = {PreviosPageHandler}
        >
            Previous Posts
        </Button>
        <Button 
        sx={{
            backgroundColor: '#aeb5b0',
            color: 'white',
            '&:hover': {
              backgroundColor:'#00CD60',
              boxShadow:2,
            },
            height: 45,
            marginTop:1,
            boxShadow:4,
          }}
        variant="contained" 
        onClick = {NextPageHandler}
        endIcon={<ArrowForwardIcon/>}>
            Next Posts
        </Button>
        </div>
        </div>
        </>
        
    );
}

export default Feed;