

import { useEffect, useRef, useState } from "react";
import "./SignUp.css";
import { Link,useNavigate } from "react-router-dom";

const PWS_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SignUp = () => {

    const emailRef = useRef();
    const errRef = useRef();

    const [email,setEmail] = useState("");
    const [ValidEmail,setValidEmail] = useState(false);
    const [EmailFocus,setEmailFocus] = useState(false);

    const [password,setPassword] = useState("");
    const [ValidPassword,setValidPassword] = useState(false);
    const [PasswordFocus,setPasswordFocus] = useState(false);

    const [rePassword,setrePassword] = useState("");
    const [SamePassword,setSamePassword] = useState(false);
    const [SamePasswordFocus,setSamePasswordFocus] = useState(false);

    const[errMsg,setErrMsg] = useState("");
    //const[successMsg,setSueccessmsg] = useState("");

    let navigate = useNavigate(); 

    useEffect(() => {

        emailRef.current.focus();
    },[]);

    useEffect(()=>{

        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
        console.log("valid email is : ",ValidEmail);

    },[email,ValidEmail]);

    useEffect(() => {

        const result = PWS_REGEX.test(password);
        console.log(result);
        console.log("Password is: ",password);
        console.log("REPassword is: ",rePassword);
        setValidPassword(result);
        const match = password ===rePassword;
        setSamePassword(match);
        if(match) {
            console.log("Yes passwords are  matched");
        }
    },[password,rePassword]);

    useEffect(() => {

        setErrMsg(""); 
    },[email,password,rePassword])

    const emailChangeHandler = (event) => {
        setEmail(event.target.value);
    }
    const PasswordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const RePasswordChangeHandler = (event) => {
        setrePassword(event.target.value);
        console.log(rePassword);
    }

    const SubmitButtonHandler = (event) => {
        event.preventDefault();
        navigate("/SignUpSecondPage", { state : {
            email : email,
            password : password
        }   
        });
        
    }
    return(
       <div className="main_class"> 
            <div className="card">
                    <p ref = {errRef} className = {errMsg ? "errmsg" : "offscreen"} aria-live = "assertive"> {errMsg}</p>
                    <h1> GENC FOOTBALL</h1>
                    <Link className="btn btn-link" to="/Login">If you have account please click here to Log in</Link> 
                    <form >
                        <div>
                            <label htmlFor= "email"></label>
                            <p id = "error_id" className= "error_text">
                                {email && !ValidEmail ? "Invalid Email Type!" : ""}
                            </p>
                            <input className= {email && !ValidEmail ? "error_input_class" :"input_class"}
                                type = "email" id = "email" placeholder="E-mail"
                                ref = {emailRef} autoComplete = "off" 
                                onChange={emailChangeHandler} required = "required" 
                                aria-invalid = {ValidEmail ? "false" : "true" } aria-describedby ="error_id"
                                onFocus = {() => setEmailFocus(true)} onBlur = {() => setEmailFocus(false)}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor= "password"></label>
                            <p id = "error_id" className= "error_text">
                                {password && !ValidPassword ? "Your password must contain at least 8 characters, an UpperLetter and a number" : ""}
                            </p>
                            <input className= {password && !ValidPassword ? "error_input_class" :"input_class"}
                                type = "password" id = "password" placeholder="Password"
                                autoComplete = "off" 
                                onChange={PasswordChangeHandler} required = "required" 
                                aria-invalid = {ValidPassword ? "false" : "true" } aria-describedby ="error_id"
                                onFocus = {() => setPasswordFocus(true)} onBlur = {() => setPasswordFocus(false)}>
                            </input>
                        </div>
                        <div>
                            <label htmlFor= "re-password"></label>
                            <p id = "error_id" className= "error_text">
                                {rePassword && !SamePassword ? "Your Password does not match!" : ""}
                            </p>
                            <input className= {rePassword && !SamePassword ? "error_input_class" :"input_class"}
                                type = "password" id = "re-password" placeholder="Please re-enter your password!"
                                autoComplete = "off" 
                                onChange={RePasswordChangeHandler} required = "required" 
                                aria-invalid = {ValidPassword ? "false" : "true" } aria-describedby ="error_id"
                                onFocus = {() => setSamePasswordFocus(true)} onBlur = {() => setSamePasswordFocus(false)}>
                            </input>
                        </div>
                        <p>By Clicking Sign In you agree to Genc Football Terms and Conditions,Privacy Policy and Cookie Policy</p>
                        <button className="btn btn-success" disabled = {ValidEmail && ValidPassword && SamePassword ? false : true} onClick={SubmitButtonHandler}>Sign Up</button>
                    </form>
            </div>
        </div>
    );
}

export default SignUp;