
// src/pages/AddGroup.jsx
import React from "react";
import AddGroupForm from "../components/AddGroupForm";

const AddGroup = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Create a New Group</h2>
      <AddGroupForm />
    </div>
  );
};

export default AddGroup;