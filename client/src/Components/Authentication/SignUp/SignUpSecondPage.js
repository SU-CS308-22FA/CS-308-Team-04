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
import navbarLogo from "../../../images/logo_light.png";
import TextField from '@mui/material/TextField';
//import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { matchIsValidTel } from 'mui-tel-input'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const Profile = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let user_email = location.state.email;
  let user_password = location.state.password;
  let userid = "";
  const [userInfo, setUserInfo] = useState({
    email: user_email,
    password: user_password,
    username: "",
    name: "",
    surname: "",
    mobile_number: "",
    birth_date: null,
    profiletype: "",
  });


  const [saveClick, setSaveClick] = useState({
    disabled : false
  });


  const handleChange = (prop) => (event) => {
    setUserInfo({ ...userInfo, [prop]: event.target.value });
  };


  const isUserExists = async (email) => {
    let response = await fetch(
      `https://genc-football-backend.herokuapp.com/GencFootball/users/${email}`
      //`/GencFootball/users/${email}`
      );
      
    console.log(response);
    if (!response.ok) {
      //const message = `An error has occurred: ${response.statusText}`;
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
            "https://genc-football-backend.herokuapp.com/GencFootball/user/add"
            //"/GencFootball/user/add"
            ,
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
          
          fetch(
            `https://genc-football-backend.herokuapp.com/GencFootball/users/${userInfo.email}`
            //`/GencFootball/users/${userInfo.email}`
            )
        .then(response => response.json())
        .then(data => {
          userid = data._id;
          console.log("creating registration for user id" + userid);
          fetch(
            "https://genc-football-backend.herokuapp.com/GencFootball/follow/registerFollow"
            //"/GencFootball/follow/registerFollow"
            ,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({user_id: userid}), // NEED USER ID
            }
          ).catch((error) => {
            window.alert(error);
            return;
          });
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
        <img alt="" style={{ maxHeight: 100 }} src={navbarLogo}></img>
      </div>
      <h1>Let's prepare your profile</h1>
      <Card>
      <form onSubmit={buttonSaveHandler}>
          <TextField
                fullWidth
                size="medium"
                type="text"
                id="outlined-basic"
                label="Username"
                variant="outlined"
                autoComplete="off"
                onChange={handleChange('username')}
                margin="normal"
                value={userInfo.username}
              /> 
          <TextField
                fullWidth
                size="medium"
                type="text"
                id="outlined-basic"
                label="Name"
                variant="outlined"
                autoComplete="off"
                onChange={handleChange('name')}
                margin="normal"
                value={userInfo.name}
              /> 
          <TextField
                fullWidth
                size="medium"
                type="text"
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                autoComplete="off"
                onChange={handleChange('surname')}
                margin="normal"
                value={userInfo.surname}
              /> 
          <TextField
                error={!matchIsValidTel(userInfo.mobile_number) && userInfo.mobile_number}
                forceCallingCode="true"
                focusOnSelectCountry="true"
                fullWidth
                size="medium"
                id={matchIsValidTel(userInfo.mobile_number) ? "outlined-basic" : "outlined-error-helper-text"}
                label="Mobile Number"
                placeholder="+1-123-456-7890"
                variant="outlined"
                value={userInfo.mobile_number}
                autoComplete="off"
                onChange={handleChange('mobile_number')}
                margin="normal"
                helperText={!matchIsValidTel(userInfo.mobile_number) && userInfo.mobile_number ? "Please enter your number in the correct format!" : ""}
              /> 
            <LocalizationProvider 
            fullWidth
            dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                size="medium"
                openTo="year"
                views={['year', 'month', 'day']}
                label="Birth Date"
                inputFormat="DD/MM/YYYY"
                value={userInfo.birth_date}
                onChange={(newValue) => {setUserInfo({...userInfo, birth_date: newValue})}}
                renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
              />
            </LocalizationProvider>

            <FormControl fullWidth
             margin="normal">
            <InputLabel id="demo-simple-select-label">Profile Type</InputLabel>
              <Select
                  id="outlined-select-profile"
                  label="Profile Type"
                  value={userInfo.profileType}
                  onChange={handleChange('profiletype')}
                >
                  <MenuItem value={"trainer"}>Trainer</MenuItem>
                  <MenuItem value={"scout"}>Scout</MenuItem>
                  <MenuItem value={"personal"}>Personal</MenuItem>
              </Select> 
            </FormControl>
            <Button
            sx={{
              backgroundColor: '#00FF77',
              color: 'white',
              '&:hover': {
                backgroundColor:'#00CD60',
                boxShadow:2,
              },
              height: 45,
              marginTop:1,
              boxShadow:4,
            }}
            fullWidth
            type="submit"
            disableElevation
            variant="contained"
            disabled={matchIsValidTel(userInfo.mobile_number) && userInfo.username && userInfo.name && userInfo.surname && userInfo.profiletype ? false : true}
            >
              Save
            </Button>
        </form>
      </Card>
    </>
  );
};
export default Profile;
