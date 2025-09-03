// GroupList.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { API_URL } from "../utils/config";

function GroupList({ groups, onJoin }) {
  const { userId } = useContext(AuthContext);

  const handleJoin = async (groupId) => {
    try {
      const res = await fetch(`${API_URL}groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Joined group successfully!`);
        if (onJoin) onJoin();
      } else {
        alert(data.error || "Failed to join group");
      }
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr>
          <th>Name</th><th>Description</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((g) => (
          <tr key={g.id}>
            <td><Link to={"/groups/" + g.id}>{g.name}</Link></td>
            <td>{g.description}</td>
            <td>
            {userId ? (
              <button
                onClick={() => handleJoin(g.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Join
              </button>
            ) : (
              <span className="text-gray-500"><Link to={"/login"}>Login to join</Link></span>
            )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GroupList;