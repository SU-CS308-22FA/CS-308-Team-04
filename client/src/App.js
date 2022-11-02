import React from "react";
import Login from "./Components/Authentication/Login/Login";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import SignUpSecondPage from "./Components/Authentication/SignUp/SignUpSecondPage";
import Profile from "./Components/Profile/Profile";
import UpdateProfile from "./Components/Profile/UpdateProfile";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navigation/navbar";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<SignUp />} />
        <Route path="/SignUpSecondPage" element={<SignUpSecondPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/UpdateProfile" element = {<UpdateProfile />} />
      </Routes>
    </div>
  );
 };

export default App;
