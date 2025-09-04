import React from "react";

function HobbyTable({ hobbies }) {
  return (
    <table className="table table-bordered table-hover w-100">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {hobbies.map((h) => (
          <tr key={h.id}>
            <td>{h.id}</td>
            <td>{h.name}</td>
            <td>{h.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HobbyTable;
