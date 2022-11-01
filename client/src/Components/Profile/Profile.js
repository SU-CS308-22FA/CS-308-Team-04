import { Button } from "bootstrap";
import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  let user_id = location.state.user_id;

  const [userInfo, setUserInfo] = useState({
    _id: "",
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: "",
  });

  useEffect(() => {
    async function fetchData() {

      //const response = await fetch(`/GencFootball/user/${user_id}`);
      const response = await fetch(`https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`);
      //console.log(response);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const user_fetch = await response.json();
      if (!user_fetch) {
        window.alert(`Record with id ${user_id} not found`);
        return;
      }
      setUserInfo(user_fetch);
    }
    fetchData();
    return;
  }, []);

  const DeleteUserHandler = async (event) => {
    event.preventDefault();
    await fetch(
      `https://genc-football-backend.herokuapp.com/GencFootball/user/${user_id}`,
      {
        method: "DELETE",
      }
    );
    window.alert("Your Account has been deleted");
    navigate("/Login");
  };

  const UpdateUserHandler = async (event) => {
    event.preventDefault();
    navigate("/UpdateProfile", {
      state: {
        userInfo: userInfo,
      },
    });
  };
  return (
    <div>
      <div className="container">
        <div class="circletag">
          <img src="https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&w=1080&fit=max&q=80&fm=jpg&crop=entropy&cs=tinysrgb" />
        </div>
      </div>
      <div className="profile_card">
        <div className="container_infobox">
          <p>Username: @{userInfo.username}</p>
        </div>
        <div className="container_infobox">
          <p>
            Full Name: {userInfo.name} {userInfo.surname}
          </p>
          <div className="divider" />
          <p>Email: {userInfo.email}</p>
        </div>
      </div>
      <div className="container">
        <button className="button" onClick={UpdateUserHandler}>
          Update!
        </button>
        <button className="button" onClick={DeleteUserHandler}>
          Delete!
        </button>
      </div>
    </div>
  );
};
export default Profile;
