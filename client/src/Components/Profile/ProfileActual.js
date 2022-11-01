import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useContext,
} from "react";

import "./ProfileActual.css";

const ProfileActual = (props) => {
  return (
    <div>
      <div className="container">
        <div class="circletag">
          <img src="https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&w=1080&fit=max&q=80&fm=jpg&crop=entropy&cs=tinysrgb" />
        </div>
      </div>
      <div className="profile_card">
        <div className="container_infobox">
          <p>@Username</p>
        </div>
        <div className="container_infobox">
          <p>Firstname Lastname</p>
          <div className="divider"/>
          <p>Email Address</p>
        </div>
      </div>
      <div className="container">
        <input className="button" type="submit" value="Edit" onClick={1} />
        <input className="button" type="submit" value="Delete" onClick={1} />
      </div>
    </div>
  );
};
export default ProfileActual;

/*<div class="cat"></div>*/ 