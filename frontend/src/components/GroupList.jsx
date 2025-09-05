import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { API_URL } from "../utils/config";

function GroupList() {
  const { userId } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [justJoined, setJustJoined] = useState({}); // track temporary joined groups

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_URL}groups`);
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Join a group
  const handleJoin = async (groupId) => {
    try {
      const res = await fetch(`${API_URL}groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        // Mark group as temporarily joined
        setJustJoined((prev) => ({ ...prev, [groupId]: true }));

        // Reset the "Joined" text after 5 seconds
        setTimeout(() => {
          setJustJoined((prev) => ({ ...prev, [groupId]: false }));
        }, 5000);

        // Fetch groups after delay to update actual membership
        setTimeout(fetchGroups, 5000);
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
            <th scope="col" style={{ width: "180px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const isMember =
              userId && g.members?.some((m) => Number(m.id) === Number(userId));
            return (
              <tr key={g.id}>
                <td>
                  <Link
                    to={`/groups/${g.id}`}
                    className="text-decoration-none fw-bold"
                  >
                    {g.name}
                  </Link>
                </td>
                <td>{g.description}</td>
                <td>
                  {userId ? (
                    isMember ? (
                      <span className="badge bg-success">
                        Already part of the group
                      </span>
                    ) : justJoined[g.id] ? (
                      <span className="badge bg-primary">Joined</span>
                    ) : (
                      <button
                        onClick={() => handleJoin(g.id)}
                        className="btn btn-sm btn-success"
                      >
                        Join
                      </button>
                    )
                  ) : (
                    <Link to="/login" className="text-muted fst-italic">
                      Login to join
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GroupList;
