import React, {
    useRef,
    useState,
    useEffect,
    useReducer,
    useContext,
  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./SignUpSecondPage.css";
  
  const Profile = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    let user_email = location.state.email;
    let user_password = location.state.password;
    

    const [userInfo, setUserInfo] = useState({
      email : user_email,
      password : user_password,
      username :"", 
      name: "",
      surname: "",
      mobile_number: "",
      birth_date: "",
    });

    

    const buttonSaveHandler = (event) => {
        event.preventDefault();
        console.log("Button is clicked");

        async function fetchData(){
            const response = await fetch("/GencFootball/user/add",{
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userInfo),
            })
            .catch(error => {
                window.alert(error);
                return;
            });
            window.alert("Your account has been successfully created. Please login.");  
        }
        fetchData();
        navigate("/Login");
        
    };
  
    return (
      <div>
        <div className="profile_prep_logo_div">
          <img
            style={{ width: 25 + "%" }}
            src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"
          ></img>
        </div>
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
                  setUserInfo({ ...userInfo, birth_date: event.target.value })
                }
                value={userInfo.birth_date}
              />
            </div>
            <div className="form-field">
              <label htmlFor="profile_type">Profile Type</label>
              <select
                id="profile_type"
                onChange={(event) =>
                  setUserInfo({ ...userInfo, profile_type: event.target.value })
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
  