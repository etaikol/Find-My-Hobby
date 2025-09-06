// src/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userMail, setUserMail] = useState(null);
  const [jwtToken, setJwtToken] = useState(null); 

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setUserRole(storedRole);
    const storedMail = localStorage.getItem("userMail");
    if (storedMail) setUserMail(storedMail);
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) setJwtToken(storedToken); 
  }, []);

  const login = (id, name, role, email, token) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", id);
    localStorage.setItem("userMail", email);
    localStorage.setItem("jwtToken", token);

    setUserId(id);
    setUserName(name);
    setUserRole(role);
    setUserMail(email);
    setJwtToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userMail");
    localStorage.removeItem("jwtToken");

    setUserId(null);
    setUserName(null);
    setUserRole(null);
    setUserMail(null);
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider value={{userId, userName, userRole, userMail, jwtToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}