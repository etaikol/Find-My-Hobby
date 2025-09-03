// src/components/EventCreateForm.jsx
import React, { useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

export default function EventCreateForm({ groupId, onCreated }) {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: "", description: "", start_time: "", end_time: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        group_id: groupId,
        creator_id: userId,
      }),
    });
    if (res.ok) {
      setFormData({ title: "", description: "" });
      if (onCreated) onCreated(); // refresh events in parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        name="title"
        placeholder="Event title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
      <input
      type="datetime-local"
      name="start_time"
      value={formData.start_time || ""}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      />
      <input
      type="datetime-local"
      name="end_time"
      value={formData.end_time || ""}
      onChange={handleChange}
      className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Event
      </button>
    </form>
  );
}