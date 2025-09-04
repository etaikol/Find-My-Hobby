// src/components/UserInfoCard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserInfoCard({ user }) {
  const { userName, userMail, userRole } = useContext(AuthContext);

  // If a user prop is provided (PublicProfile), use it.
  // Otherwise, fallback to AuthContext (Profile).
  const displayUser = user || {
    username: userName,
    email: userMail,
    role: userRole,
  };

  if (!displayUser) return null;

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold">{displayUser.username}</h1>
      <p className="text-gray-600">{displayUser.email}</p>
      <p className="italic text-gray-500">{displayUser.role}</p>
    </div>
  );
}