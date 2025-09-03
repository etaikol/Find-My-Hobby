import React, { useEffect, useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EventCreateForm from "./EventCreateForm";

export default function GroupEvents({ groupId, creatorId }) {
  const { userId } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}groups/${groupId}/events`);
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [groupId]);

  const isOwner = creatorId === userId;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Group Events</h3>
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map((ev) => (
            <li key={ev.id} className="border p-2 rounded">
              <Link
                to={`/events/${ev.id}`}
                className="font-bold text-blue-600 hover:underline"
              >
                {ev.title}
              </Link>
              <p>{ev.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events yet</p>
      )}

      {isOwner && (
        <EventCreateForm groupId={groupId} onCreated={fetchEvents} />
      )}
    </div>
  );
}