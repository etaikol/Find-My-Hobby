import React, { useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const GroupEditForm = ({ group, onUpdated, onDelete }) => {
  const { userId, userRole } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
  });

  const canEdit =
    Number(group.creator.id) === Number(userId) || userRole === "admin";
  if (!canEdit) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}groups/${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          current_user_id: userId,
          current_user_role: userRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdated(data);
        setEditing(false);
      } else {
        alert(data.error || "Failed to update group");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="d-flex align-items-center gap-2 mt-2">
        <button
          onClick={() => setEditing(true)}
          className="btn btn-warning flex-shrink-0"
        >
          Edit
        </button>
        {onDelete && (
          <button
            onClick={() =>
              window.confirm("Are you sure you want to delete this group?")
                ? onDelete(group.id)
                : null
            }
            className="btn btn-danger flex-shrink-0"
          >
            Delete
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mt-3 shadow-sm">
      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-bold">
          Group Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          disabled={saving}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-bold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          rows="3"
          disabled={saving}
        />
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="btn btn-secondary"
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GroupEditForm;
