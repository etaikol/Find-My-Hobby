import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../utils/config";
import { useParams } from "react-router-dom";
import UserInfoCard from "../components/UserInfoCard";
import UserGroupsList from "../components/UserGroupList";
import UserHobbyList from "../components/UserHobbyList";
import AddUserHobbyForm from "../components/AddUserHobbyForm";

export default function PublicProfile() {
  const { userRole } = useContext(AuthContext);
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [userHobbies, setUserHobbies] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  // --- API calls ---
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      setUser(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

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
      fetchUser();
      fetchUserHobbies();
      fetchUserGroups();
    }
  }, [userId]);

  // --- Render ---
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* User Info */}
      <UserInfoCard user={user}/>

      {/* Groups */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          {user ? `${user.username}'s Groups` : "Groups"}
        </h2>
        <UserGroupsList groups={userGroups} />
      </section>

      {/* Hobbies */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          {user ? `${user.username}'s Hobbies` : "My Hobbies"}
        </h2>
        <UserHobbyList
          hobbies={userHobbies}
          onRemove={userRole === "admin" ? handleRemoveHobby : null}
        />
        {userRole === "admin" && (
          <AddUserHobbyForm
            userId={userId}
            userHobbies={userHobbies}
            onAdded={fetchUserHobbies}
          />
        )}
      </section>
    </div>
  );
}