import React, {useContext} from "react";
import Login from "./Components/Login/Login";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

import Navbar from "./Components/navbar";
import RecordList from "./Components/recordList";
import Edit from "./Components/edit";
import Create from "./Components/create";
import Profile from "./Components/Profile/Profile";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Profile/>} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
 };

export default App;
