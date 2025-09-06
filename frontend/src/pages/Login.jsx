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
        const { token, user } = data;
        login(user.id, user.username, user.role, user.email, token);
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
  <div className="container mt-5" style={{ maxWidth: "400px" }}>
    <h1 className="mb-4 text-center">Login</h1>
    <LoginForm onSubmit={handleLogin} />
    <div className="mt-3 text-center">
      <Link to="/register">Don’t have an account? Register here!</Link>
    </div>
    {responseMessage && (
      <p className="alert alert-info mt-3">{responseMessage}</p>
    )}
  </div>
);
}

export default Login;