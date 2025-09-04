import React, { useState } from "react";
import { Link } from "react-router-dom";

function UserTable({ users, onUpdateUser, onDeleteUser }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = (user) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const cancelEditing = () => {
    if (isSaving) return; // prevent cancel during save
    setEditingId(null);
    setFormData({});
  };

  const saveEditing = async () => {
    setIsSaving(true);
    try {
      await onUpdateUser(formData);
      setEditingId(null);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${user.username}" (ID: ${user.id})?`
      )
    ) {
      onDeleteUser(user.id);
    }
  };

  return (
    <table border="1" cellPadding="8" cellSpacing="0" className="w-full">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) =>
          editingId === u.id ? (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="border p-1"
                  disabled={isSaving}
                />
              </td>
              <td>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border p-1"
                  disabled={isSaving}
                />
              </td>
              <td>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="border p-1"
                  disabled={isSaving}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={saveEditing}
                  disabled={isSaving}
                  className={`${
                    isSaving
                      ? "bg-gray-300"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-2 py-1 mr-2 rounded`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ) : (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td><Link to={"/users/" + u.id}>{u.username}</Link></td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => startEditing(u)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(u)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default UserTable;