import React from "react";
import UserManagementSection from "../components/UserManagementSection";
import HobbyManagementSection from "../components/HobbyManagementSection";

export default function Managedashboard() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">User Management Dashboard</h1>
      <UserManagementSection />
      <HobbyManagementSection />
    </div>
  );
}