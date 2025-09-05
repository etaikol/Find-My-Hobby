import React, { useState } from "react";
import { API_URL } from "../utils/config";
import RegisterForm from "../components/RegisterForm";

function Register() {
  const [responseMessage, setResponseMessage] = useState("");

  const handleRegister = async (formData) => {
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
  <div className="container mt-5" style={{ maxWidth: "400px" }}>
    <h1 className="mb-4 text-center">Register</h1>
    <RegisterForm onSubmit={handleRegister} />
    {responseMessage && (
      <p className="alert alert-info mt-3">{responseMessage}</p>
    )}
  </div>
);
}

export default Register;