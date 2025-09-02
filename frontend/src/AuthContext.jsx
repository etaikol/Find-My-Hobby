// src/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserName(storedId);
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserId(storedName);
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
  }, []);

  const login = (id, name, role) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", id);
    setUserId(id);
    setUserName(name);
    setUserRole(role);   // ✅ this updates state immediately

  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUserId(null);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{userId, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}