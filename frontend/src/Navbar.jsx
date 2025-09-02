// src/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";  // ✅ import context

function Navbar() {
  const {userId, userName, userRole, logout } = useContext(AuthContext); // ✅ get live role + logout

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        
        {/* ✅ Only show for admins */}
        {userRole === "admin" && (
          <Link to="/managedashboard" className="hover:text-blue-400">
            Users Dashboard
          </Link>
        )}
      </div>

      <div>
        {userId ? (
          <>
            <span className="mr-4">Welcome: {userName}</span>
            <span className="mr-4">Role: {userRole}</span>
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
