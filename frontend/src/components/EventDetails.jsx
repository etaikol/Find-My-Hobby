// src/components/EventDetails.jsx
import React from "react";

export default function EventDetails({ event }) {
  if (!event) return null;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="mt-2">{event.description}</p>
      <p>
        <strong>Start:</strong> {new Date(event.start_time).toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {new Date(event.end_time).toLocaleString()}
      </p>
      <p>
        <strong>Created By:</strong> {event.creator_username}
      </p>
      <p>
        <strong>Visibility:</strong> {event.visibility}
      </p>
    </div>
  );
}