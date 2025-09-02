// src/components/Profile.jsx
import { API_URL } from "./config";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function Profile() {
  const { userId, userName, userRole, userMail } = useContext(AuthContext);
  const [userHobbies, setUserHobbies] = useState([]);
  const [allHobbies, setAllHobbies] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState("");

  // fetch hobbies for this user
  const fetchUserHobbies = async () => {
    try {
      const res = await fetch(`${API_URL}users/${userId}/hobbies`);
      if (!res.ok) throw new Error("Failed to fetch user hobbies");
      const hobbies = await res.json();
      setUserHobbies(hobbies);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch all hobbies
  const fetchAllHobbies = async () => {
    try {
      const res = await fetch(`${API_URL}hobbies`);
      if (!res.ok) throw new Error("Failed to fetch hobbies");
      const hobbies = await res.json();
      setAllHobbies(hobbies);
    } catch (err) {
      console.error(err);
    }
  };

  // add hobby to user
  const handleAddHobby = async () => {
    if (!selectedHobby) return;
    try {
      const res = await fetch(`${API_URL}users/${userId}/hobbies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hobby_id: parseInt(selectedHobby) }),
      });
      if (!res.ok) throw new Error("Failed to add hobby");
      await fetchUserHobbies(); // refresh table
      setSelectedHobby("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserHobbies();
      fetchAllHobbies();
    }
  }, [userId]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{userName}</h1>
      <p className="text-gray-600">
        {userMail} — <span className="italic">{userRole}</span>
      </p>

      {/* User Hobbies Table */}
      <h2 className="text-xl font-semibold mt-6 mb-2">My Hobbies</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          {userHobbies.length > 0 ? (
            userHobbies.map((hobby) => (
              <tr key={hobby.id} className="border-t">
                <td className="p-2">{hobby.id}</td>
                <td className="p-2">{hobby.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-2 text-center" colSpan="2">
                No hobbies yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Hobby */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Add a Hobby</h3>
        <div className="flex gap-2">
          <select
            value={selectedHobby}
            onChange={(e) => setSelectedHobby(e.target.value)}
            className="border p-2 rounded flex-grow"
          >
            <option value="">Select a hobby...</option>
            {allHobbies
              .filter((h) => !userHobbies.some((uh) => uh.id === h.id)) // exclude already added
              .map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddHobby}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}