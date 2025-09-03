
import React from "react";
import { Link } from "react-router-dom";

function UserGroupsList({ groups }) {
  if (!groups.length) {
    return <p>Not participating in groups yet</p>;
  }

  return (
    <ul className="list-disc ml-6">
      {groups.map((g) => (
        <li key={g.id}>
          <strong><Link to={"/groups/" + g.id}>{g.name}</Link></strong> – {g.description}
          <span className="text-gray-500">
            {" "} (creator: {g.creator?.username})
          </span>
        </li>
      ))}
    </ul>
  );
}

export default UserGroupsList;