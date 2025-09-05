import React from "react";
import { Link } from "react-router-dom";

function UserGroupsList({ groups }) {
  if (!groups.length) {
    return <p className="text-muted">Not participating in any groups yet.</p>;
  }

  return (
    <ul className="list-group">
      {groups.map((g) => (
        <li key={g.id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start mb-2 shadow-sm rounded">
          <div>
            <Link to={`/groups/${g.id}`} className="fw-bold text-decoration-none">
              {g.name}
            </Link>
            <p className="mb-0">{g.description}</p>
          </div>
          {g.creator?.username && (
            <small className="text-muted mt-2 mt-md-0">
              Creator: {g.creator.username}
            </small>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UserGroupsList;
