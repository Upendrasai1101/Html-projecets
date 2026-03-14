import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // BrowserRouter — enables React Router throughout the app
  <BrowserRouter>
    {/* AuthProvider — Context API, wraps entire app for global auth state */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
