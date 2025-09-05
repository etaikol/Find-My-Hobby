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
    <div className="card shadow-sm" style={{ maxWidth: "400px" }}>
      <div className="card-body">
        <h5 className="card-title">{displayUser.username}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{displayUser.email}</h6>
        <p className="card-text">
          <span className="badge bg-secondary">{displayUser.role}</span>
        </p>
      </div>
    </div>
  );
}
