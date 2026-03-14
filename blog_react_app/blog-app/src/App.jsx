import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

// ── ProtectedRoute — conditional rendering for auth ───────────
// If not logged in, redirect to login page
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // Conditional rendering — redirect if not authenticated
  return user ? children : <Navigate to="/login" />;
};

// ── App — React Router with all pages ────────────────────────
const App = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        {/* React Router — defines all page routes */}
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/blog"        element={<BlogList />} />
          <Route path="/blog/:id"    element={<BlogDetail />} />
          <Route path="/login"       element={<Login />} />
          {/* Protected Routes — require login */}
          <Route path="/create"      element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          {/* Catch all — redirect to home */}
          <Route path="*"            element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
