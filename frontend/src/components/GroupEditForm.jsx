import React, { useState, useContext } from "react";
import { API_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const GroupEditForm = ({ group, onUpdated }) => {
  const { userId, userRole } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: group.name, description: group.description });

  const canEdit = Number(group.creator.id) === Number(userId) || userRole === "admin";
  if (!canEdit) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
        onUpdated(data); // update parent with returned group
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
      <button
        onClick={() => setEditing(true)}
        className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Edit Group
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border p-3 rounded bg-gray-50">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={saving}
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="block w-full border p-2"
        disabled={saving}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GroupEditForm;