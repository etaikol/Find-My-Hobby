import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "./config";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempted:", formData);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData) // send JSON
      });

      const data = await response.json();
      
      if (response.ok) {
        setResponseMessage(data.message);
        // Fetch user details to get role
        const userRes = await fetch(`${BACKEND_BASE_URL}users/${data.id}`);
        const userData = await userRes.json();
        setUserRole(userData.role);
        
        localStorage.setItem("userRole", userData.role);
        // Redirect to homepage
        navigate("/");
      } else {
        setResponseMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Something went wrong!");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        /><br /><br />
        <button type="submit">Login</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Login;