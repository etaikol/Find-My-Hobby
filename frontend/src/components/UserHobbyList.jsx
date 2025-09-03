import React from "react";

function UserHobbyList({ hobbies, onRemove }) {
  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {hobbies.length > 0 ? (
          hobbies.map((hobby) => (
            <tr key={hobby.id} className="border-t">
              <td className="p-2">{hobby.name}</td>
              <td className="p-2">
                <button
                  onClick={() => onRemove(hobby.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-2 text-center" colSpan="3">
              No hobbies yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserHobbyList;