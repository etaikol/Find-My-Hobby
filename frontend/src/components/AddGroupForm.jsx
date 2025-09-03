// src/components/AddGroupForm.jsx
import React, { useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const AddGroupForm = ({ onSuccess }) => {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, creator_id: userId };
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Group added successfully!");
        setFormData({ name: "", description: "" });
        if (onSuccess) onSuccess(); // ✅ Refresh parent table if provided
      } else {
        setMessage(data.error || "Failed to add group");
      }
    } catch (err) {
      console.error("Error adding group:", err);
      setMessage("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3 className="mb-2">Add Group</h3>
      <input
        type="text"
        name="name"
        placeholder="Group name"
        value={formData.name}
        onChange={handleChange}
        className="block mb-2 border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Hobby description"
        value={formData.description}
        onChange={handleChange}
        className="block mb-2 border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Group
      </button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default AddGroupForm;