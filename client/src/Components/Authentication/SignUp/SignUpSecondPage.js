import React, {
  //useRef,
  useState,
  //useEffect,
  //useReducer,
  //useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./SignUpSecondPage.module.css";
import Card from "../../UI/Card/Card";
import navbarLogo from "../../../images/navbar-logo.png";
var moment = require("moment");

const Profile = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let user_email = location.state.email;
  let user_password = location.state.password;
  const [userInfo, setUserInfo] = useState({
    email: user_email,
    password: user_password,
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: new Date(Date.now()),
  });

  const [saveClick, setSaveClick] = useState({
    disabled : false
  });

  const isUserExists = async (email) => {
    let response = await fetch(`https://genc-football-backend.herokuapp.com/GencFootball/users/${email}`);
      
    console.log(response);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      return null;
    }
    if (response.status === 404) {
      //user not found
      return false;
    }
    //user exists
    return true;
  }

  const buttonSaveHandler = (event) => {
    //double click prevention
    event.preventDefault();
    if(saveClick.disabled) {
      return;
    }
    setSaveClick({disabled:true})

    isUserExists(userInfo.email).then(
       (isExists) => {
        if(!isExists)
        {
          fetch(
            "https://genc-football-backend.herokuapp.com/GencFootball/user/add",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userInfo),
            }
          ).catch((error) => {
            window.alert(error);
            return;
          });
          window.alert("Your account has been successfully created. Please login.");
          navigate("/Login");
        }
        else {
          window.alert("Email has already been exist.");
        }
      })

    
  };

  return (
    <>
      <div className={classes.logo_div}>
        <img alt="" style={{ maxHeight: 150 }} src={navbarLogo}></img>
      </div>
      <h1>Let's prepare your profile</h1>
      <Card>
        <form>
          <div className={classes.input_field}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              required
              onChange={(event) =>
                setUserInfo({ ...userInfo, username: event.target.value })
              }
              value={userInfo.username}
            />
          </div>
          <div className={classes.input_field}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              onChange={(event) =>
                setUserInfo({ ...userInfo, name: event.target.value })
              }
              value={userInfo.name}
            />
          </div>
          <div className={classes.input_field}>
            <label htmlFor="surname">Last Name</label>
            <input
              type="text"
              name="surname"
              id="surname"
              required
              onChange={(event) =>
                setUserInfo({ ...userInfo, surname: event.target.value })
              }
              value={userInfo.surname}
            />
          </div>
          <div className={classes.input_field}>
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              id="mobile_number"
              onChange={(event) =>
                setUserInfo({
                  ...userInfo,
                  mobile_number: event.target.value,
                })
              }
              value={userInfo.mobile_number}
              required
            />
          </div>
          <div className={classes.input_field}>
            <label htmlFor="birth_date">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              id="birth_date"
              required
              onChange={(event) =>
                setUserInfo({
                  ...userInfo,
                  birth_date: new Date(event.target.value),
                })
              }
              value={moment(userInfo.birth_date).format("yyyy-MM-DD")}
            />
          </div>
          <div className={classes.input_field}>
            <label htmlFor="profile_type">Profile Type</label>
            <select
              id="profile_type"
              onChange={(event) =>
                setUserInfo({ ...userInfo, profile_type: "Personal" })
              }
            >
              <option value="trainer">Trainer</option>
              <option value="scout">Scout</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <button
            className={classes.submit_button}
            type="submit"
            value="Save"
            onClick={buttonSaveHandler}
            disabled={saveClick.disabled}>
              {saveClick.disabled ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </Card>
    </>
  );
};
export default Profile;
