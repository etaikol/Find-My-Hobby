// src/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar() {
  const { userId, userName, userRole, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-blue-400">Home</Link>

        {/* ✅ Only for logged-in users */}
        {userId && (
          <Link to="/profile" className="hover:text-blue-400">
            Profile
          </Link>
        )}

        {/* ✅ Only for admins */}
        {userRole === "admin" && (
          <Link to="/managedashboard" className="hover:text-blue-400">
            Users Dashboard
          </Link>
        )}
      </div>

      <div>
        {userId ? (
          <>
            <span className="mr-4">Welcome: {userName}</span><br />
            <span className="mr-4">Role: {userRole}</span><br />
            <button
              onClick={logout}
              className="hover:text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 mr-4">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;