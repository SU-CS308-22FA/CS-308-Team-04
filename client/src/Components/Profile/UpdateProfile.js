import React, {
  //useRef,
  useState,
  //useEffect,
  //useReducer,
  //useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpdateProfile.css";
import navbarLogo from "../../images/logo_light.png";
import classes from "./UpdateProfile.css";
import Card from "../UI/Card/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { matchIsValidTel } from "mui-tel-input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { USE_LOCAL_BACKEND } from "../../config.js";
import { FormControlLabel } from "@mui/material";
const UpdateProfile = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let userInfo = location.state.userInfo;

  const [userUpdatedInfo, setUpdatedUserInfo] = useState({
    _id: userInfo._id,
    email: userInfo.email,
    password: userInfo.password,
    username: userInfo.username,
    name: userInfo.name,
    surname: userInfo.surname,
    mobile_number: userInfo.mobile_number,
    birth_date: userInfo.birth_date,
    post_photo_url: userInfo.post_photo_url,
    isPrivate: userInfo.isPrivate,
  });

  const handleChange = (prop) => (event) => {
    setUpdatedUserInfo({ ...userUpdatedInfo, [prop]: event.target.value });
  };

  const buttonCancelHandler = (event) => {
    event.preventDefault();
    navigate("/Profile", {
      state: {
        user_id: userUpdatedInfo._id,
      },
    });
  };

  /**
   * Handles the click event for updating a user's profile.
   * Makes a PUT request to the backend to update the user's information.
   * Displays a success message and navigates to the profile page for the updated user.
   *
   * @param {Event} event - The event object for the click event.
   */
  const buttonUpdateHandler = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userUpdatedInfo),
    };
    fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/user/${userUpdatedInfo._id}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/user/${userUpdatedInfo._id}`,
      requestOptions
    )
      .catch((err) => {
        console.log("Caught error", err);
      })
      .then((response) => response.json());
    window.alert("User successfully updated");
    navigate("/Profile", {
      state: {
        user_id: userUpdatedInfo._id,
      },
    });
  };
  return (
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
            <img
              className="profile_logo_change"
              alt="cat"
              src={userUpdatedInfo.post_photo_url}
            />
            <TextField
              fullWidth
              size="medium"
              type="text"
              id="outlined-basic"
              label="Profile Photo"
              variant="outlined"
              autoComplete="off"
              onChange={handleChange("post_photo_url")}
              margin="normal"
              value={userUpdatedInfo.post_photo_url}
            />
            <TextField
              fullWidth
              size="medium"
              type="text"
              id="outlined-basic"
              label="Username"
              variant="outlined"
              autoComplete="off"
              onChange={handleChange("username")}
              margin="normal"
              value={userUpdatedInfo.username}
            />
            <TextField
              fullWidth
              size="medium"
              type="text"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              autoComplete="off"
              onChange={handleChange("name")}
              margin="normal"
              value={userUpdatedInfo.name}
            />
            <TextField
              fullWidth
              size="medium"
              type="text"
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              autoComplete="off"
              onChange={handleChange("surname")}
              margin="normal"
              value={userUpdatedInfo.surname}
            />
            <TextField
              error={
                !matchIsValidTel(userUpdatedInfo.mobile_number) &&
                userUpdatedInfo.mobile_number
              }
              forceCallingCode="true"
              focusOnSelectCountry="true"
              fullWidth
              size="medium"
              id={
                matchIsValidTel(userUpdatedInfo.mobile_number)
                  ? "outlined-basic"
                  : "outlined-error-helper-text"
              }
              label="Mobile Number"
              placeholder="+1-123-456-7890"
              variant="outlined"
              value={userUpdatedInfo.mobile_number}
              autoComplete="off"
              onChange={handleChange("mobile_number")}
              margin="normal"
              helperText={
                !matchIsValidTel(userUpdatedInfo.mobile_number) &&
                userUpdatedInfo.mobile_number
                  ? "Please enter your number in the correct format!"
                  : ""
              }
            />
            <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                size="medium"
                openTo="year"
                views={["year", "month", "day"]}
                label="Birth Date"
                inputFormat="DD/MM/YYYY"
                value={userUpdatedInfo.birth_date}
                onChange={(newValue) => {
                  setUpdatedUserInfo({
                    ...userUpdatedInfo,
                    birth_date: newValue,
                  });
                }}
                renderInput={(params) => (
                  <TextField fullWidth margin="normal" {...params} />
                )}
              />
            </LocalizationProvider>
            <FormControlLabel
              control={
                <Switch
                  checked={userUpdatedInfo.isPrivate}
                  onChange={() => {
                    setUpdatedUserInfo({
                      ...userUpdatedInfo,
                      isPrivate: !userUpdatedInfo.isPrivate,
                    });
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Set Profile as Private:"
              labelPlacement="start"
            ></FormControlLabel>
            <Button
              sx={{
                backgroundColor: "#00FF77",
                color: "white",
                "&:hover": {
                  backgroundColor: "#00CD60",
                  boxShadow: 2,
                },
                height: 45,
                marginTop: 1,
                marginRight: 1.98,
                boxShadow: 4,
                width: 9 / 20,
              }}
              onClick={buttonUpdateHandler}
              disableElevation
              variant="contained"
              disabled={
                matchIsValidTel(userUpdatedInfo.mobile_number) &&
                userUpdatedInfo.username &&
                userUpdatedInfo.name &&
                userUpdatedInfo.surname
                  ? false
                  : true
              }
            >
              Save
            </Button>
            <Button
              sx={{
                backgroundColor: "#00FF77",
                color: "white",
                "&:hover": {
                  backgroundColor: "#00CD60",
                  boxShadow: 2,
                },
                height: 45,
                marginTop: 1,
                marginLeft: 2,
                boxShadow: 4,
                width: 9 / 20,
              }}
              onClick={buttonCancelHandler}
              disableElevation
              variant="contained"
              disabled={
                matchIsValidTel(userUpdatedInfo.mobile_number) &&
                userUpdatedInfo.username &&
                userUpdatedInfo.name &&
                userUpdatedInfo.surname
                  ? false
                  : true
              }
            >
              Cancel
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};
export default UpdateProfile;
