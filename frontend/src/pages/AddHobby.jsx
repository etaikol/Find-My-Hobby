
// src/pages/AddHobby.jsx
import React from "react";
import AddHobbyForm from "../components/AddHobbyForm";

const AddHobby = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Create a New Hobby</h2>
      <AddHobbyForm />
    </div>
  );
};

export default AddHobby;