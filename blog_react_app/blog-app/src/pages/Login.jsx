import React, { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useCustomHooks";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

// ── Validation Function ───────────────────────────────────────
// ES6 Arrow Function — validates login form fields
const validate = (values) => {
  const errors = {};
  if (!values.email)                          errors.email    = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email  = "Invalid email format";
  if (!values.password)                        errors.password = "Password is required";
  else if (values.password.length < 4)         errors.password = "Min 4 characters";
  return errors;
};

// ── Login Page ────────────────────────────────────────────────
// Uses: Custom Hook (useForm), Context API (useAuth),
//       useRef, useEffect, React Router, Form Validation,
//       conditional rendering, Material UI Icons
const Login = () => {
  const { login, user } = useAuth();   // Context API
  const navigate        = useNavigate(); // React Router
  const emailRef        = useRef(null);  // useRef — auto focus

  // Custom Hook — form state + validation
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: "", password: "", name: "" },
    validate
  );

  // useEffect — redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // useEffect — auto focus email input on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // ES6 Arrow Function — handle login submit
  const onSubmit = (formValues) => {
    // Mock authentication — in real app, call API
    const userData = {
      id:    Date.now(),
      name:  formValues.name || formValues.email.split("@")[0],
      email: formValues.email,
    };
    login(userData); // Context API — save user globally
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <LoginIcon style={{ fontSize: "2.5rem", color: "#6c63ff" }} />
          <h1>Welcome Back</h1>
          <p>Login to start writing and reading</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>

          {/* Name Field */}
          <div className="form-group">
            <label><PersonIcon fontSize="small" /> Your Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Upendra"
              className="form-input"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label><PersonIcon fontSize="small" /> Email *</label>
            <input
              ref={emailRef} // useRef attached
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={`form-input ${touched.email && errors.email ? "form-input--error" : ""}`}
            />
            {/* Conditional rendering — show error */}
            {touched.email && errors.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label><LockIcon fontSize="small" /> Password *</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min 4 characters"
              className={`form-input ${touched.password && errors.password ? "form-input--error" : ""}`}
            />
            {/* Conditional rendering — show error */}
            {touched.password && errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            <LoginIcon fontSize="small" /> Login
          </button>
        </form>

        <p className="auth-card__switch">
          Don't have an account? Just fill in any email & password to get started!
        </p>
      </div>
    </div>
  );
};

export default Login;
