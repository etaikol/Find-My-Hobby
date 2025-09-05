// src/pages/EventShow.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/config";
import EventDetails from "../components/EventDetails";
import EventEditForm from "../components/EventEditForm";
import { AuthContext } from "../context/AuthContext";

export default function EventShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, userRole } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}events/${id}`);
      const data = await res.json();
      if (res.ok) {
        setEvent(data);
      } else {
        setError(data.error || "Failed to load event");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const canEditOrDelete = () => {
    if (!event) return false;
    if (userRole === "admin") return true;
    if (event.creator_id === userId) return true;
    if (event.group_admins?.includes(userId)) return true;
    return false;
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_URL}events/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_user_id: userId, current_user_role: userRole })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Event deleted successfully");
        navigate("/"); // or navigate to group page
      } else {
        alert(data.error || "Failed to delete event");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="p-4">Loading event...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!event) return <p className="p-4">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <EventDetails event={event} />

      {canEditOrDelete() && (
        <div className="mt-4 flex gap-2">
          <EventEditForm
            event={event}
            onUpdated={updatedEvent => setEvent(updatedEvent)}
          />
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
}