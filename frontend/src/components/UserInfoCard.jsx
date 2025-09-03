import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserInfoCard() {
  const { userName, userMail, userRole } = useContext(AuthContext);

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold">{userName}</h1>
      <p className="text-gray-600">{userMail}</p>
      <p className="italic text-gray-500">{userRole}</p>
    </div>
  );
}