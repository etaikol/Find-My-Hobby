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
    <div className="table-responsive mt-4">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col" style={{ width: "150px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id}>
              <td>
                <Link to={`/groups/${g.id}`} className="text-decoration-none fw-bold">
                  {g.name}
                </Link>
              </td>
              <td>{g.description}</td>
              <td>
                {userId ? (
                  <button
                    onClick={() => handleJoin(g.id)}
                    className="btn btn-sm btn-success"
                  >
                    Join
                  </button>
                ) : (
                  <Link to="/login" className="text-muted fst-italic">
                    Login to join
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroupList;
