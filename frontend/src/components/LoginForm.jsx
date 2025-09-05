// components/LoginForm.jsx
import React, { useState } from "react";

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="text"
          name="email"
          className="form-control"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
