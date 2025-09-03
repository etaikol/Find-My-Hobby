// src/App.jsx
import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {API_URL} from "./utils/config.js"

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Managedashboard from "./pages/Managedashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";   // ✅ import
import Profile from "./pages/Profile.jsx";
import AddHobby from "./pages/AddHobby.jsx";
import AddGroup from "./pages/AddGroup.jsx";
import GroupShow from "./components/GroupShow.jsx";
import ShowGroup from "./pages/ShowGroup.jsx";
import GroupList from "./components/GroupList.jsx";

function Home() {
  const { userId } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);

const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_URL}/groups`);
      const data = await res.json();
      if (res.ok) setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Welcome to FindMyHobby!</h1>
      <h2>It's time to find a Hobby</h2>

      {userId ? (
      <Link to="/add-group" className="text-blue-500 underline">
        Create a Group
      </Link>
      ) : (
      <Link to="/login" className="text-blue-500 underline">
        Login to create a Group
      </Link>
      )}
      
      <GroupList groups={groups} onJoin={fetchGroups} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>   {/* ✅ Wrap the whole app */}
      <Router>
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/managedashboard" element={<Managedashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-hobby" element={<AddHobby />} />
            <Route path="/add-group" element={<AddGroup />} />
            <Route path="/groups/:id" element={<ShowGroup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
