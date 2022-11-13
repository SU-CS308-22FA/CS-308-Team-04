import React, {
  //useRef,
  useState,
  useEffect,
  //useReducer,
  //useContext,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import Card from "../../UI/Card/Card";
import navbarLogo from "../../../images/logo_dark.png";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_user_exist, setisUserExist] = useState(false);
  const [ValidEmail, setValidEmail] = useState(false);
  

  let navigate = useNavigate();


  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
    console.log("valid email is : ", ValidEmail);
  }, [email, ValidEmail]);


  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });
  
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const EmailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const PasswordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const loginHandler = async (event) => {
    event.preventDefault();

    async function fetchData() {
      //const response = await fetch(`/GencFootball/users/${email}`);
      const response = await fetch(
        `https://genc-football-backend.herokuapp.com/GencFootball/users/${email}`
      );
      console.log(response);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      if (response.status === 404) {
        //user not found
        window.alert("No user registered with that email");
        setisUserExist(false);
        return;
      }
      //user exists
      setisUserExist(true);
      return response.json();
    }
    await fetchData()
      .then((user_obj) => {
        if (!user_obj) {
          return;
        } //user not found
        console.log(user_obj)
        
        console.log("user id is :", user_obj._id);
        if (user_obj.password === values.password) {
          localStorage.setItem('user', user_obj._id);
          navigate("/Profile", {
            state: {
              user_id: user_obj._id,
            },
          });
          return;
        }
        //wrong pass
        window.alert("Wrong password");
      })
      .catch((error) => window.alert(error));
  };
  return (

    <Card>
      <img alt="" style={{ maxHeight: 80 }} src={navbarLogo}></img>
      <form onSubmit={loginHandler}> 
        <TextField
            error={email && !ValidEmail}
            fullWidth
            size="medium"
            type="email"
            id={email && !ValidEmail ? "outlined-basic" : "outlined-error-helper-text"}
            label="E-Mail"
            variant="outlined"
            autoComplete="off"
            onChange={EmailChangeHandler}
            margin="dense"
            helperText={email && !ValidEmail ? "Invalid Email Type!" : ""}
          /> 
        <FormControl 
        fullWidth
        variant="outlined"
        margin="dense"
        >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
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
            label="Password"
          />
        </FormControl>
        
        <Button
        sx={{
          backgroundColor: '#00FF77',
          color: 'white',
          '&:hover': {
            backgroundColor:'#00CD60',
          },
          marginTop: 1,
          marginBottom: 1,
          height: 45,
        }}
        fullWidth
        type="submit"
        disableElevation
        variant="contained"
        disabled={ValidEmail ? false : true}
        >
          Log In
        </Button>
      </form>
      <div className={classes.divider}>
        <hr></hr>
        <p>or</p>
        <hr></hr>
      </div>
      <div className={classes.sign_in_div}>
        <p>Dont have an account?</p>
        <Link className={classes.sign_in_button} to="/">
          Sign up
        </Link>
      </div>
      
      <button className={classes.media_button}>
        <img></img>
        <p>Sign in with Google</p>
      </button>
      <button className={classes.media_button}>
        <img></img>
        <p>Sign in with Facebook</p>
      </button>
    </Card>
  );
};
export default Login;
