import React, {useRef,useState,useEffect,useReducer,useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../SignUp/SignUp.css";
const Login = (props) => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [is_user_exist,setisUserExist] = useState(false);

  let navigate = useNavigate();

  const EmailChangeHandler = (event) =>{

    setEmail(event.target.value);
  }

  const PasswordChangeHandler = (event) =>{

    setPassword(event.target.value);
  }

  const loginHandler = async (event) => {

    event.preventDefault();
    
    async function fetchData(){

      //const response = await fetch(`/GencFootball/users/${email}`);
      const response = await fetch(`https://genc-football-backend.herokuapp.com/GencFootball/users/${email}`);
      //console.log(response);
      if(!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const user_fetch = await response.json();
      console.log(user_fetch);
      if(!user_fetch){
        window.alert(`Record with id ${email} not found`)
        setisUserExist(false);
        return;
      }
      setisUserExist(true);
      console.log(user_fetch._id);
      return { user_id :user_fetch._id,
        user_passwrd :user_fetch.password};
    }
    let user_obj = await fetchData();
    let user_id = user_obj.user_id;
    let user_password = user_obj.user_passwrd;
  
    console.log("user id is :",user_id);
    if(is_user_exist){ 
      if(user_password == password ){
        navigate("/Profile",{state : {
          user_id : user_id
        }
      });
      }
      else{
        window.alert("Wrong password");
      }
    }
  };


  return (
    <div>
    <div>
      <form onSubmit={loginHandler}>
        <label htmlfor="email"></label>
        <input type="email"  className = "input_class" 
          id="email" placeholder="E-mail"
          autoComplete="off" onChange={EmailChangeHandler} required="required"/>
        <label htmlfor="password"></label>
        <input type="password" className="input_class" 
          id="password" placeholder="Password" 
          autoComplete="off" onChange={PasswordChangeHandler}/>
        <button className="btn btn-success" type="btn btn-succes">login</button>
      </form>
    </div>
    </div>
  );
};
export default Login;
