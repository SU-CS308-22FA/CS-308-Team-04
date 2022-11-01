import React, {
    useRef,
    useState,
    useEffect,
    useReducer,
    useContext,
  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const UpdateProfile = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    let userInfo = location.state.userInfo;

    const [userUpdatedInfo, setUpdatedUserInfo] = useState({
        _id : userInfo._id,
        email : userInfo.email,
        password : userInfo.password,
        username : userInfo.username, 
        name: userInfo.name,
        surname: userInfo.surname,
        mobile_number: userInfo.mobile_number,
        birth_date:  moment(userInfo.birth_date).utc().format('yyyy-MM-dd')
      });

      

    const buttonUpdateHandler = (event) =>{
        event.preventDefault();
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userUpdatedInfo)
      };
      fetch(`/GencFootball/user/${userUpdatedInfo._id}`, requestOptions)
      .catch(err => {
        console.log("Caught error",err);
      })
      .then(response => response.json());
      window.alert("User successfully updated");
    };
    return(

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
                  setUpdatedUserInfo({ ...userUpdatedInfo, username: event.target.value })
                }
                value={userUpdatedInfo.username}
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
                  setUpdatedUserInfo({ ...userUpdatedInfo, name: event.target.value })
                }
                value={userUpdatedInfo.name}
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
                  setUpdatedUserInfo({ ...userUpdatedInfo, surname: event.target.value })
                }
                value={userUpdatedInfo.surname}
              />
            </div>
            <div className="form-field">
              <label htmlFor="mobile_number">Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                id="mobile_number"
                onChange={(event) =>
                  setUpdatedUserInfo({ ...userUpdatedInfo, mobile_number: event.target.value })
                }
                value={userUpdatedInfo.mobile_number}
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
                    setUpdatedUserInfo({ ...userUpdatedInfo, birth_date: event.target.value })
                }
                value={userUpdatedInfo.birth_date}
              />
            </div>
            <input
              className="button"
              type="submit"
              value="Save"
              onClick={buttonUpdateHandler}
            />
          </form>
        </div>
      </div>

    );
}
export default UpdateProfile;