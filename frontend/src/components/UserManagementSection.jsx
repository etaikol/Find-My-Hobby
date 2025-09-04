import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/config";
import UserTable from "./UserTable";

export default function UserManagementSection() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      });
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const res = await fetch(`${API_URL}/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUsers((prev) =>
        prev.map((u) => (u.id === data.id ? data : u))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      // remove from UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-2">Users</h2>
      {error && <p className="text-red-500">{error}</p>}
      <UserTable
        users={users}
        onUpdateUser={handleUpdate}
        onDeleteUser={handleDelete}
      />
    </div>
  );
}