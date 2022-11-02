import React, {
  //useRef,
  useState,
  //useEffect,
  //useReducer,
  //useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import "../SignUp/SignUp.css";
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
        console.log("user id is :", user_obj._id);
        if (user_obj.password === password) {
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
    <div>
      <div>
        <form onSubmit={loginHandler}>
          <label htmlfor="email"></label>
          <input
            type="email"
            className="input_class"
            id="email"
            placeholder="E-mail"
            autoComplete="off"
            onChange={EmailChangeHandler}
            required="required"
          />
          <label htmlfor="password"></label>
          <input
            type="password"
            className="input_class"
            id="password"
            placeholder="Password"
            autoComplete="off"
            onChange={PasswordChangeHandler}
          />
          <button className="btn btn-success" type="btn btn-succes">
            login
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
