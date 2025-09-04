import React, { useState, useEffect } from "react";
import { API_URL } from "../utils/config";

function AddUserHobbyForm({ userId, userHobbies, onAdded }) {
  const [allHobbies, setAllHobbies] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState("");

  const fetchAllHobbies = async () => {
    try {
      const res = await fetch(`${API_URL}hobbies`);
      const data = await res.json();
      setAllHobbies(data);
    } catch (err) {
      console.error("Failed to fetch hobbies", err);
    }
  };

  const handleAdd = async () => {
    if (!selectedHobby) return;
    try {
      const res = await fetch(`${API_URL}users/${userId}/hobbies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hobby_id: parseInt(selectedHobby) }),
      });
      if (res.ok) {
        onAdded(); // refresh parent
        setSelectedHobby("");
      }
    } catch (err) {
      console.error("Failed to add hobby", err);
    }
  };

  useEffect(() => {
    fetchAllHobbies();
  }, []);

  return (
    <div className="mt-4">
      <h5 className="mb-3">Add a Hobby</h5>
      <div className="d-flex gap-2">
        <select
          value={selectedHobby}
          onChange={(e) => setSelectedHobby(e.target.value)}
          className="form-select flex-grow-1"
        >
          <option value="">Select a hobby...</option>
          {allHobbies
            .filter((h) => !userHobbies.some((uh) => uh.id === h.id))
            .map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
        </select>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex-shrink-0"
          disabled={!selectedHobby}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddUserHobbyForm;
