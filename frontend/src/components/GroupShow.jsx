// src/components/GroupShow.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../utils/config";
import GroupEvents from "./GroupEvents";

const GroupShow = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${API_URL}/groups/${id}`);
        const data = await res.json();
        if (res.ok) {
          setGroup(data);
        } else {
          setError(data.error || "Failed to load group");
        }
      } catch (err) {
        setError("Something went wrong!");
      }
    };
    fetchGroup();
  }, [id]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!group) return <p className="p-4">Loading group...</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{group.name}</h2>
      <p>{group.description}</p>
      <p className="mt-2">
        <strong>Creator:</strong> {group.creator.username}
      </p>

      <h3 className="mt-4 font-semibold">Members:</h3>
      <ul className="list-disc ml-6">
        {group.members.length > 0 ? (
          group.members.map((m) => (
            <li key={m.id}>{m.username}</li>
          ))
        ) : (
          <p>No members yet</p>
        )}
      </ul>
      <GroupEvents groupId={group.id} creatorId={group.creator.id} />
    </div>
  );
};

export default GroupShow;