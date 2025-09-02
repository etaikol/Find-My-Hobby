import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../utils/config";
import UserTable from "../components/UserTable";
import HobbyTable from "../components/HobbyTable";

const Managedashboard = () => {
  const [users, setUsers] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      });

    fetch(`${API_URL}/hobbies`)
      .then((res) => res.json())
      .then(setHobbies)
      .catch((err) => {
        console.error("Error fetching hobbies:", err);
        setError("Failed to load hobbies.");
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">User Management Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <UserTable users={users} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg">Hobbies</h2>
          {/* Clean button link to Add Hobby Page */}
          <Link
            to="/add-hobby"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Hobby
          </Link>
        </div>
        <HobbyTable hobbies={hobbies} />
      </div>
    </div>
  );
};

export default Managedashboard;
