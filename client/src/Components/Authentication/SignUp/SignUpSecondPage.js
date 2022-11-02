import React, {
  //useRef,
  useState,
  //useEffect,
  //useReducer,
  //useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SignUpSecondPage.css";
var moment = require('moment');  


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

  const buttonSaveHandler = async (event) => {
    event.preventDefault();
    await fetch(
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
  };

  return (
    <div>
      <div className="profile_prep_text_div">
        <h1 className="profile_prep_text">Let's prepare your profile</h1>
      </div>
      <div className="profile_prep_form_card">
        <form>
          <div className="form-field">
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
          <div className="form-field">
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
          <div className="form-field">
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
          <div className="form-field">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              id="mobile_number"
              onChange={(event) =>
                setUserInfo({ ...userInfo, mobile_number: event.target.value })
              }
              value={userInfo.mobile_number}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="birth_date">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              id="birth_date"
              required
              onChange={(event) =>
                setUserInfo({ ...userInfo, birth_date: new Date(event.target.value) })
              }
              value={moment(userInfo.birth_date).format("yyyy-MM-DD")}
            />
          </div>
          <div className="form-field">
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
          <input
            className="button"
            type="submit"
            value="Save"
            onClick={buttonSaveHandler}
          />
        </form>
      </div>
    </div>
  );
};
export default Profile;
