import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import { Link } from "react-router-dom";
import HobbyTable from "./HobbyTable";

export default function HobbyManagementSection() {
  const [hobbies, setHobbies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/hobbies`)
      .then((res) => res.json())
      .then(setHobbies)
      .catch((err) => {
        console.error("Error fetching hobbies:", err);
        setError("Failed to load hobbies.");
      });
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg">Hobbies</h2>
        <Link
          to="/add-hobby"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Hobby
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <HobbyTable hobbies={hobbies} />
    </div>
  );
}