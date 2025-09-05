import React, { useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

export default function EventCreateForm({ groupId, onCreated }) {
  const { userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setFormData({ title: "", description: "", start_time: "", end_time: "" });
      if (onCreated) onCreated(); // refresh events in parent
    }
  };

  return (
    <div className="card card-body shadow-sm mt-3">
      <h5 className="card-title mb-3">Create New Event</h5>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-12">
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
