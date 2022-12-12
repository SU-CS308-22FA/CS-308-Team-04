import React, { useRef, useState, useEffect } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../UI/Card/Card";
import navbarLogo from "../../../images/logo_dark.png";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { FormHelperText } from "@mui/material";
import { USE_LOCAL_BACKEND } from "../../../config.js";
const PWS_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SignUp = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [ValidEmail, setValidEmail] = useState(false);
  const [EmailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [ValidPassword, setValidPassword] = useState(false);
  const [PasswordFocus, setPasswordFocus] = useState(false);

  const [rePassword, setrePassword] = useState("");
  const [SamePassword, setSamePassword] = useState(false);
  const [SamePasswordFocus, setSamePasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  //const[successMsg,setSueccessmsg] = useState("");

  const [values, setValues] = React.useState({
    amount: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  /**
   * This function shows the password of the user when he/she
   * clicks on the show password field.
   */
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  let navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
    console.log("valid email is : ", ValidEmail);
  }, [email, ValidEmail]);

  useEffect(() => {
    const result = PWS_REGEX.test(password);
    console.log(result);
    setValidPassword(result);
    const match = password === rePassword;
    setSamePassword(match);
    if (match) {
      console.log("Yes passwords are  matched");
    }
  }, [password, rePassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, rePassword]);

  /**
   * This function handles email variable when user enters.
   * @param {event} event of the email change event.
   */
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  /**
   * This function handles password variable when user enters.
   * @param {event} event of the password change event.
   */
  const PasswordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  /**
   * This function handles re-password variable when user enters.
   * @param {event} event of the password change event.
   */
  const RePasswordChangeHandler = (event) => {
    setrePassword(event.target.value);
    console.log(rePassword);
  };

  /**
   * This function try to fetch a user with given email address.
   * If successful returns true, else returns false.
   * @param {string} email of the user.
   */
  const isUserExists = async (email) => {
    let response = await fetch(
      USE_LOCAL_BACKEND
        ? `/GencFootball/users/${email}`
        : `https://genc-football-backend.herokuapp.com/GencFootball/users/${email}`
    );

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
  };

  /**
   * This function checks if user exists.
   * then if successful navigates user to second
   * signup page.
   * @param {event} event
   */
  const SubmitButtonHandler = (event) => {
    event.preventDefault();

    isUserExists(email).then((isExists) => {
      if (!isExists) {
        navigate("/SignUpSecondPage", {
          state: {
            email: email,
            password: password,
          },
        });
      } else {
        window.alert("Email has already been exist.");
      }
    });
  };

  return (
    <Card>
      <img alt="" className="logo" src={navbarLogo}></img>
      <form onSubmit={SubmitButtonHandler}>
        <TextField
          error={email && !ValidEmail}
          fullWidth
          size="medium"
          type="email"
          id={
            email && !ValidEmail
              ? "outlined-basic"
              : "outlined-error-helper-text"
          }
          label="E-Mail"
          ref={emailRef}
          variant="outlined"
          autoComplete="off"
          onChange={emailChangeHandler}
          margin="dense"
          helperText={email && !ValidEmail ? "Invalid Email Type!" : ""}
        />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel
            error={values.password && !ValidPassword}
            htmlFor="outlined-adornment-password"
          >
            Password
          </InputLabel>
          <OutlinedInput
            error={values.password && !ValidPassword}
            id={
              values.password && !ValidPassword
                ? "outlined-basic"
                : "outlined-error"
            }
            type={values.showPassword ? "text" : "password"}
            value={password}
            onChange={PasswordChangeHandler}
            label="Password"
            helperText={
              values.password && !ValidPassword ? "Invalid Password!" : ""
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {!!(values.password && !ValidPassword) && (
            <FormHelperText error id="password-error">
              {"Invalid Password!"}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel
            error={values.confirmpassword && !SamePassword}
            htmlFor="outlined-adornment-password"
          >
            Confirm Password
          </InputLabel>
          <OutlinedInput
            error={values.confirmpassword && !SamePassword}
            id={
              values.confirmpassword && !SamePassword
                ? "outlined-basic"
                : "outlined-error-helper-text"
            }
            type={values.showPassword ? "text" : "password"}
            value={rePassword}
            helperText={
              values.confirmpassword && !SamePassword
                ? "Passwords do not match!"
                : ""
            }
            onChange={RePasswordChangeHandler}
            label="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {!!(values.confirmpassword && !SamePassword) && (
            <FormHelperText error id="confirmpassword-error">
              {"Passwords do not match!"}
            </FormHelperText>
          )}
        </FormControl>

        <p>
          By Clicking Sign In you agree to Genc Football ,Privacy Policy and
          Cookie Policy
        </p>

        <Button
          sx={{
            backgroundColor: "#00FF77",
            color: "white",
            "&:hover": {
              backgroundColor: "#00CD60",
            },
            height: 45,
          }}
          fullWidth
          type="submit"
          disableElevation
          variant="contained"
          disabled={ValidEmail && ValidPassword && SamePassword ? false : true}
        >
          Sign Up
        </Button>
      </form>
      <div className={classes.divider}>
        <hr></hr>
        <p>or</p>
        <hr></hr>
      </div>
      <div className={classes.sign_in_div}>
        <p>Already on Genc Football?</p>
        <Link className={classes.sign_in_button} to="/Login">
          Log in
        </Link>
      </div>

      <button className={classes.media_button}>
        <img></img>
        <p>Sign up with Google</p>
      </button>
      <button className={classes.media_button}>
        <img></img>
        <p>Sign up with Facebook</p>
      </button>
    </Card>
  );
};

export default SignUp;
