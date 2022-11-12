import React from "react";
import navbarLogo from "../../images/navbar-logo.png";
/*In the navbar.js component, we will create a navigation bar
 that will link us to the required components using the following code. */

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

import classes from './navbar.module.css'

// Here, we display our Navbar
export default function Navbar(props) {
 return (
   <div className= {classes.div}>
     <nav className={classes.navbar}>
       <NavLink to="/">
       <img alt="" style={{"maxHeight" : 50, "margin" : 0}} src={navbarLogo}></img>
       </NavLink>
       <NavLink to="/Feed">
        <p className={classes.title}>Feed</p>
       </NavLink>
       <NavLink to="/Profile">
        <p className={classes.title}>Profile</p>
       </NavLink>
     </nav>
   </div>
 );
}