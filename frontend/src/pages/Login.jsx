// pages/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";

function Login() {
  const [responseMessage, setResponseMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        const userRes = await fetch(`${API_URL}users/${data.id}`);
        const userData = await userRes.json();
        login(userData.id, userData.username, userData.role, userData.email);
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
      <LoginForm onSubmit={handleLogin} />
      <Link to="/register">Don’t have an account? Register here!</Link>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Login;