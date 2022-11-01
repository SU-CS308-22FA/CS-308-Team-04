import React, {useContext} from "react";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import SignUpSecondPage from "./Components/SignUp/SignUpSecondPage";
import Profile from "./Components/Profile/Profile";
import UpdateProfile from "./Components/Profile/UpdateProfile";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

import Navbar from "./Components/navbar";
import RecordList from "./Components/recordList";
import Edit from "./Components/edit";
import Create from "./Components/create";


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<SignUp />} />
        <Route path="/SignUpSecondPage" element={<SignUpSecondPage />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/UpdateProfile" element = {<UpdateProfile />} />
      </Routes>
    </div>
  );
 };

export default App;
