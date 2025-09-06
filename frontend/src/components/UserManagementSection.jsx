import React, { useEffect, useState, useContext } from "react";
import { API_URL } from "../utils/config";
import UserTable from "./UserTable";
import { AuthContext } from "../context/AuthContext";

export default function UserManagementSection() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { jwtToken } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = () => {
    if (!jwtToken) {
      setError("Not authenticated");
      return;
    }
    console.log("JWT Token:", jwtToken);
    fetch(`${API_URL}users`, {
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setUsers)
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      });
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const res = await fetch(`${API_URL}users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    } catch (err) {
      console.error(err);
      setError("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${API_URL}users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
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