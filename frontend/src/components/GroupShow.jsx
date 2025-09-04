import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import GroupEditForm from "./GroupEditForm";

const GroupShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, userRole } = useContext(AuthContext);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/groups/${id}`);
        const data = await res.json();
        if (res.ok) setGroup(data);
        else setError(data.error || "Failed to load group");
      } catch {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      const res = await fetch(`${API_URL}/groups/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_user_id: userId, current_user_role: userRole }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Group deleted successfully!");
        navigate("/");
      } else {
        alert(data.error || "Failed to delete group");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="p-4">Loading group...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!group) return <p className="p-4">Group not found</p>;

  const canEdit = Number(userId) === Number(group.creator.id) || userRole === "admin";

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">{group.name}</h2>
      <p>{group.description}</p>
      <p><strong>Creator:</strong> {group.creator.username}</p>

      {canEdit && (
        <div className="flex gap-2 mt-2">
          <GroupEditForm group={group} onUpdated={setGroup} />
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete Group
          </button>
        </div>
      )}

      <h3 className="mt-4 font-semibold">Members:</h3>
      <ul className="list-disc ml-6">
        {group.members.length > 0
          ? group.members.map((m) => <li key={m.id}>{m.username}</li>)
          : <p>No members yet</p>}
      </ul>
    </div>
  );
};

export default GroupShow;