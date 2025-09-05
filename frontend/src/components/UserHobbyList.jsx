import React from "react";

function UserHobbyList({ hobbies, onRemove }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th style={{ width: "80px" }}></th>
          </tr>
        </thead>
        <tbody>
          {hobbies.length > 0 ? (
            hobbies.map((hobby) => (
              <tr key={hobby.id}>
                <td>{hobby.name}</td>
                <td>
                  <button
                    onClick={() => onRemove(hobby.id)}
                    className="btn btn-sm btn-danger"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No hobbies yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserHobbyList;
