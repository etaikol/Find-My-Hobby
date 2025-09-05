import React, { useEffect, useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EventCreateForm from "./EventCreateForm";

export default function GroupEvents({ groupId, creatorId }) {
  const { userId } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}groups/${groupId}/events`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [groupId]);

  const isOwner = creatorId === userId;

  return (
    <div className="mt-4">
      <h3 className="mb-3">Group Events</h3>

      {events.length > 0 ? (
        <div className="row g-3">
          {events.map((ev) => (
            <div key={ev.id} className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <Link
                    to={`/events/${ev.id}`}
                    className="card-title h5 text-primary text-decoration-none"
                  >
                    {ev.title}
                  </Link>
                  <p className="card-text mt-2">{ev.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No events yet.</p>
      )}

      {isOwner && (
        <div className="mt-4">
          <EventCreateForm groupId={groupId} onCreated={fetchEvents} />
        </div>
      )}
    </div>
  );
}
