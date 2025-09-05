// src/components/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../utils/config";

import UserInfoCard from "../components/UserInfoCard";
import UserGroupsList from "../components/UserGroupList";
import UserHobbyList from "../components/UserHobbyList";
import AddUserHobbyForm from "../components/AddUserHobbyForm";

export default function Profile() {
  const { userId } = useContext(AuthContext);
  const [userHobbies, setUserHobbies] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  // --- API calls ---
  const fetchUserHobbies = async () => {
    try {
      const res = await fetch(`${API_URL}users/${userId}/hobbies`);
      if (!res.ok) throw new Error("Failed to fetch user hobbies");
      setUserHobbies(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const res = await fetch(`${API_URL}users/${userId}/groups`);
      if (!res.ok) throw new Error("Failed to fetch user groups");
      setUserGroups(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveHobby = async (hobbyId) => {
    try {
      const res = await fetch(`${API_URL}users/${userId}/hobbies/${hobbyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove hobby");
      fetchUserHobbies();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserHobbies();
      fetchUserGroups();
    }
  }, [userId]);

  // --- Render ---
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* User Info */}
      <UserInfoCard />

      {/* Groups */}
      <section>
        <h2 className="text-xl font-semibold mb-2">My Groups</h2>
        <UserGroupsList groups={userGroups} />
      </section>

      {/* Hobbies */}
      <section>
        <h2 className="text-xl font-semibold mb-2">My Hobbies</h2>
        <UserHobbyList hobbies={userHobbies} onRemove={handleRemoveHobby} />
        <AddUserHobbyForm
          userId={userId}
          userHobbies={userHobbies}
          onAdded={fetchUserHobbies}
        />
      </section>
    </div>
  );
}
