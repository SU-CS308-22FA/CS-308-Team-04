import React, {useRef,useState,useEffect,useReducer,useContext,
} from "react";
import { useLocation } from "react-router-dom";

const Login = (props) => {

  
  const loginHandler = () => {
    <></>;
  };

  return (
    <div>

      <form onSubmit={loginHandler}>
        <label for="uname">username:</label>
        <input type="text" id="uname" name="uname" />
        <label for="pass">pass:</label>
        <input type="text" id="pass" name="pass" />
        <button type="submit">login</button>
      </form>
    </div>
  );
};
export default Login;
