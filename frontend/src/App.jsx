// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import Managedashboard from "./Managedashboard";
import { AuthProvider } from "./AuthContext.jsx";   // ✅ import

function Home() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}auth/test`)
      .then((response) => response.text())
      .then((text) => setMessage(text))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <h1>Message from Flask Backend:</h1>
        <p>{message}</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Link to Register Page */}
      <Link to="/register">
        <button>Go to Register</button>
      </Link>
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
