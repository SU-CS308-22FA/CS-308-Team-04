import React from "react";
import navbarLogo from "../../images/navbar-logo.png";
/*In the navbar.js component, we will create a navigation bar
 that will link us to the required components using the following code. */

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
import { Link, useNavigate } from "react-router-dom";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

import classes from './navbar.module.css'

// Here, we display our Navbar
export default function Navbar(props) {

  let navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    navigate("/Login")
  }

  const FeedPageHandler = () => {
    const user_id = localStorage.getItem("user");
    navigate("/Feed",{
      state : {
        user_id : user_id
      },
    });

    return;
  }
 return (
   <div className= {classes.div}>
     <nav className={classes.navbar}>
       <NavLink to="/">
       <img alt="" style={{"maxHeight" : 50, "margin" : 0}} src={navbarLogo}></img>
       </NavLink>
       <button className={classes.title} style={{'padding':'0', 'border':'0', 'backgroundColor': 'white'}} onClick = {FeedPageHandler}>Feed
       </button>
       <button className={classes.title} style={{'padding':'0', 'border':'0', 'backgroundColor': 'white'}} onClick={logoutHandler}>Logout
       </button>
       <NavLink to="/Profile">
        <p className={classes.title}>Profile</p>
       </NavLink>
     </nav>
   </div>
 );
}