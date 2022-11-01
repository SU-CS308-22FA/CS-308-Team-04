import React, { useRef, useState, useEffect, useReducer, useContext } from "react";
import { useLocation } from "react-router-dom";


const Profile = (props) => {

  const location = useLocation();

let user_id = location.state.user_id;

return (
  <div>
  <p1>YEY YOU DID IT </p1>
  <p1>{user_id}</p1>
  </div>
);
}
export default Profile;