import React from "react";
import navbarLogo from "../../images/navbar-logo.png";
/*In the navbar.js component, we will create a navigation bar
 that will link us to the required components using the following code. */

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navbar(props) {
 return (
   <div className= {props.className}>
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
       <NavLink className="navbar-brand" to="/">
       <img alt="" style={{"maxHeight" : 100}} src={navbarLogo}></img>
       </NavLink>
       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav ml-auto">
         </ul>
       </div>
     </nav>
   </div>
 );
}