// src/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar() {
  const { userId, userName, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Find My Hobby
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          {userId && (
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </li>
          )}

          {userRole === "admin" && (
            <li className="nav-item">
              <Link to="/managedashboard" className="nav-link">
                Users Dashboard
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav">
          {userId ? (
            <>
              <li className="nav-item me-3 text-light">
                Welcome: <strong>{userName}</strong>
              </li>
              <li className="nav-item me-3 text-light">
                Role: <strong>{userRole}</strong>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
