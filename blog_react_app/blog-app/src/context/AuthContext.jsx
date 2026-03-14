import React, { createContext, useState, useContext, useEffect } from "react";

// ── AuthContext — Context API ─────────────────────────────────
// Global state for authentication — available everywhere in app
// Uses: createContext, useState, useEffect, localStorage

// Create context
const AuthContext = createContext(null);

// ── AuthProvider — wraps entire app ──────────────────────────
export const AuthProvider = ({ children }) => {
  // useState — stores logged in user globally
  const [user, setUser] = useState(null);

  // useEffect — check localStorage on app load (persist login)
  useEffect(() => {
    const savedUser = localStorage.getItem("blogUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // restore user from localStorage
    }
  }, []); // empty dependency array = runs once on mount

  // ES6 Arrow Function — login, save to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("blogUser", JSON.stringify(userData));
  };

  // ES6 Arrow Function — logout, clear localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("blogUser");
    localStorage.removeItem("blogPosts");
  };

  return (
    // Provide user, login, logout to all child components
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook — useAuth ─────────────────────────────────────
// Reusable hook to access auth context anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export default AuthContext;
