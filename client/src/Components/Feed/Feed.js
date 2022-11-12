import { useEffect, useState } from "react";
import Navbar from "../Navigation/navbar";
import PostsList from "../Profile/PostsList";
import classes from "./Feed.module.css"
const Feed = (props) => {

    const [PostList,setPostList] = useState([]);
    const [PageNum,setPageNum] = useState(0);
    const encodedValue = encodeURIComponent(PageNum);
    useEffect(() => {
        fetch(
           // `https://genc-football-backend.herokuapp.com/GencFootball/posts/getposts?page=${encodedValue}`
            `/GencFootball/posts/getposts?page=${encodedValue}`
            )
        .catch(err => {
            console.log("Caught error",err);
        })
        .then(response => response.json())
        .then(data =>{ 
            setPostList(data.posts_list);
            setPageNum(0);
            //console.log(PostList)
        })
    },[/*PostList*//*PageNum*/]);
    //console.log(PostList);
    
    return(
        <>
        <Navbar className="Navbar"/>
        <div className= {classes.body}>
        <div className= {classes.posts}>
        <PostsList list = {PostList}></PostsList>
        </div>
        </div>
        </>
        
    );
}

export default Feed;