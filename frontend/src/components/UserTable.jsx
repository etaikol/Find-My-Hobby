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
    if (isSaving) return;
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
    <table className="table table-bordered table-hover w-100">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
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
                  className="form-control form-control-sm"
                  disabled={isSaving}
                />
              </td>
              <td>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-control form-control-sm"
                  disabled={isSaving}
                />
              </td>
              <td>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="form-select form-select-sm"
                  disabled={isSaving}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="d-flex gap-2">
                <button
                  onClick={saveEditing}
                  disabled={isSaving}
                  className={`btn btn-primary btn-sm`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={isSaving}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ) : (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                <Link to={"/users/" + u.id}>{u.username}</Link>
              </td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="d-flex gap-2">
                <button
                  onClick={() => startEditing(u)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(u)}
                  className="btn btn-danger btn-sm"
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
