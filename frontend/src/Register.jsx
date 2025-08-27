import React, { useState } from "react";
import { API_URL } from "./config";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register form submitted:", formData);

    try {
      const response = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData) // send JSON
      });

      const data = await response.json();
      setResponseMessage(data.message); // show Flask response
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Something went wrong!");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        /><br /><br />
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
        <button type="submit">Register</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Register;