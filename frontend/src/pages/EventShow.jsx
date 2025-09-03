// src/pages/EventShow.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../utils/config";
import EventDetails from "../components/EventDetails";

const EventShow = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}events/${id}`);
        const data = await res.json();
        if (res.ok) setEvent(data);
        else setError(data.error || "Failed to load event");
      } catch (err) {
        setError("Something went wrong!");
      }
    };
    fetchEvent();
  }, [id]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!event) return <p className="p-4">Loading event...</p>;

  return <EventDetails event={event} />;
};

export default EventShow;