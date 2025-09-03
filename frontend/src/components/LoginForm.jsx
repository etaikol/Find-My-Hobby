// components/LoginForm.jsx
import React, { useState } from "react";

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({ 
    email: "",
    password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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
  );
}

export default LoginForm;