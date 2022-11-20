import React, {
  //useRef,
  useState,
  //useEffect,
  //useReducer,
  //useContext,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import Card from "../../UI/Card/Card";
import navbarLogo from "../../../images/logo_dark.png";


const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_user_exist, setisUserExist] = useState(false);

  let navigate = useNavigate();

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
        //`/GencFootball/users/${email}`
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
        if (user_obj.password === password) {
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
        <div className={classes.input_field}>
        <input
            type="email"
            id="email"
            placeholder="E-mail"
            autoComplete="off"
            onChange={EmailChangeHandler}
            required="required"
          />
          
        </div>
        <div className={classes.input_field}>
        <input
            type="password"
            id="password"
            placeholder="Password"
            autoComplete="off"
            onChange={PasswordChangeHandler}
          />
          
        </div>
        
        <button className={classes.submit_button}>
          Log In
        </button>
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
