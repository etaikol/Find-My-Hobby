// src/components/EventEditForm.jsx
import React, { useState, useContext, useEffect } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

export default function EventEditForm({ event, onUpdated }) {
  const { userId, userRole } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    visibility: "public"
  });

  // Initialize formData from event
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start_time: event.start_time?.slice(0, 16) || "", // for datetime-local input
        end_time: event.end_time?.slice(0, 16) || "",
        visibility: event.visibility || "public"
      });
    }
  }, [event]);

  const canEdit = () => {
    if (!event) return false;
    if (userRole === "admin") return true;
    if (event.creator_id === userId) return true;
    if (event.group_admins?.includes(userId)) return true;
    if (event.group_owner_id === userId) return true;
    return false;
  };

  if (!canEdit()) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          current_user_id: userId,
          current_user_role: userRole
        })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdated(data);
        setEditing(false);
      } else {
        alert(data.error || "Failed to update event");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Edit Event
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-2 border p-3 rounded bg-gray-50"
    >
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={loading}
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={loading}
      />
      <input
        type="datetime-local"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={loading}
      />
      <input
        type="datetime-local"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={loading}
      />
      <select
        name="visibility"
        value={formData.visibility}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={loading}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={loading}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
