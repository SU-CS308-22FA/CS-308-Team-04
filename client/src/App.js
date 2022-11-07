import React from "react";
import Login from "./Components/Authentication/Login/Login";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import SignUpSecondPage from "./Components/Authentication/SignUp/SignUpSecondPage";
import Profile from "./Components/Profile/Profile";
import UpdateProfile from "./Components/Profile/UpdateProfile";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navigation/navbar";
import Card from "./Components/UI/Card/Card";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      {/*<Navbar className="Navbar"/>*/}
      <div className="Content">
        <Routes>
          <Route exact path="/" element={<SignUp />} />
          <Route path="/SignUpSecondPage" element={<SignUpSecondPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/UpdateProfile" element={<UpdateProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
