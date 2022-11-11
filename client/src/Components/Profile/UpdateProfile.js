import React, {
    //useRef,
    useState,
    //useEffect,
    //useReducer,
    //useContext,
  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import "./UpdateProfile.css"
import navbarLogo from "../../images/logo_light.png";
import classes from "./UpdateProfile.css";
import Card from "../UI/Card/Card";

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
        birth_date:  new Date(userInfo.birth_date)
      });

    const buttonCancelHandler = (event) =>
    {
      event.preventDefault();
      navigate("/Profile",{state : {
        user_id : userUpdatedInfo._id
      }})
    };

    const buttonUpdateHandler = (event) =>{
        event.preventDefault();
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userUpdatedInfo)
      };
      fetch(`https://genc-football-backend.herokuapp.com/GencFootball/user/${userUpdatedInfo._id}`, requestOptions)
      .catch(err => {
        console.log("Caught error",err);
      })
      .then(response => response.json());
      window.alert("User successfully updated");
      navigate("/Profile",{state : {
        user_id : userUpdatedInfo._id
      }})
    };
    return(
      <>
      
        <div className={classes.logo_div}>
          <img alt="" style={{ maxHeight: 100 }} src={navbarLogo}></img>
        </div>
        <div>
        <div className={classes.profile_prep_text_div}>
          <h1 className={classes.profile_prep_text}>Update your information</h1>
        </div>
        <Card>
            <form>
            <div className={classes.form_field}>
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
              <div className={classes.form_field}>
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
              <div className={classes.form_field}>
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
              <div className={classes.form_field}>
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
              <div className={classes.form_field}>
                <label htmlFor="birth_date">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  id="birth_date"
                  required
                  onChange={(event) =>
                      setUpdatedUserInfo({ ...userUpdatedInfo, birth_date: new Date(event.target.value) })
                  }
                  value={moment(userUpdatedInfo.birth_date).format("yyyy-MM-DD")}
                />
              </div>
              <div className={classes.buttons}>
              <button
                className="button" type="submit" onClick={buttonUpdateHandler}>Save </button>
              <button
              className="button" onClick={buttonCancelHandler}>Back</button>
              </div>
            </form>
        </Card>
      </div>
    </>  
    );
}
export default UpdateProfile;