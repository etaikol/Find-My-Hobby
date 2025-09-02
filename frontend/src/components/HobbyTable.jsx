// src/components/HobbyTable.jsx
function HobbyTable({ hobbies }) {
  return (
    <table border="1" cellPadding="8" cellSpacing="0">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Description</th>
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