import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useContext,
} from "react";
import "./Profile.css";

const Profile = (props) => {
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    birth_date: "",
    profile_type: "",
  });
  const buttonSaveHandler = () => {};

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
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              onChange={(event) =>
                setUserInfo({ ...userInfo, first_name: event.target.value })
              }
              value={userInfo.first_name}
            />
          </div>
          <div className="form-field">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              onChange={(event) =>
                setUserInfo({ ...userInfo, last_name: event.target.value })
              }
              value={userInfo.last_name}
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
            />
          </div>
          <div className="form-field">
            <label htmlFor="birth_date">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              id="birth_date"
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
