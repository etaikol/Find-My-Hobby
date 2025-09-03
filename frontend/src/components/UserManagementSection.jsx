import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import UserTable from "./UserTable";

export default function UserManagementSection() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl mb-2">Users</h2>
      {error && <p className="text-red-500">{error}</p>}
      <UserTable users={users} />
    </div>
  );
}