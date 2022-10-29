import React, {useContext} from "react";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

import Navbar from "./Components/navbar";
import RecordList from "./Components/recordList";
import Edit from "./Components/edit";
import Create from "./Components/create";
import SignUpv2 from "./Components/SignUpV2/SignUpv2";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<SignUp />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
 };

export default App;
