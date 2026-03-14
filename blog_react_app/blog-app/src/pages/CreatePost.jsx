import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useCustomHooks";
import { useLocalStorage } from "../hooks/useCustomHooks";
import { useAuth } from "../context/AuthContext";
import SendIcon from "@mui/icons-material/Send";

// ── Validation ────────────────────────────────────────────────
const validate = (values) => {
  const errors = {};
  if (!values.title)              errors.title    = "Title is required";
  else if (values.title.length < 5) errors.title  = "Title must be at least 5 characters";
  if (!values.body)               errors.body     = "Content is required";
  else if (values.body.length < 20) errors.body   = "Content must be at least 20 characters";
  if (!values.category)           errors.category = "Please select a category";
  return errors;
};

// ── CreatePost Page ───────────────────────────────────────────
// Uses: Custom Hook (useForm, useLocalStorage), Context API (useAuth),
//       useRef, React Router, Form Validation, ES6 Spread, Arrow Functions
const CreatePost = () => {
  const navigate              = useNavigate();
  const { user }              = useAuth(); // Context API — get logged in user
  const titleRef              = useRef(null); // useRef — auto focus
  const [posts, setPosts]     = useLocalStorage("blogPosts", []); // Custom Hook

  const categories = ["Technology", "Lifestyle", "Travel", "Food", "Health"];

  // Custom Hook — form management
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
    { title: "", body: "", category: "" },
    validate
  );

  // ES6 Arrow Function — handle post creation
  const onSubmit = (formValues) => {
    const newPost = {
      // ES6 Spread — create new post object
      ...formValues,
      id:     Date.now(),
      author: user?.name || "Anonymous",
      date:   new Date().toISOString(),
      likes:  0,
    };

    // Custom Hook — save to localStorage
    setPosts([newPost, ...posts]); // ES6 Spread

    resetForm();
    navigate("/blog");
  };

  return (
    <div className="create-page">
      <div className="create-page__header">
        <h1>✍️ Write a New Post</h1>
        <p>Share your thoughts with the world</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="create-form" noValidate>

        {/* Title */}
        <div className="form-group">
          <label>Post Title *</label>
          <input
            ref={titleRef}
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write a compelling title..."
            className={`form-input ${touched.title && errors.title ? "form-input--error" : ""}`}
          />
          {touched.title && errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${touched.category && errors.category ? "form-input--error" : ""}`}
          >
            <option value="">Select a category...</option>
            {/* ES6 Map — render category options */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {touched.category && errors.category && <span className="form-error">{errors.category}</span>}
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Content *</label>
          <textarea
            name="body"
            value={values.body}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write your post content here..."
            rows={10}
            className={`form-input ${touched.body && errors.body ? "form-input--error" : ""}`}
          />
          {touched.body && errors.body && <span className="form-error">{errors.body}</span>}
          {/* Conditional rendering — character count */}
          {values.body && (
            <span className="char-count">{values.body.length} characters</span>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/blog")}>Cancel</button>
          <button type="submit" className="btn btn--primary">
            <SendIcon fontSize="small" /> Publish Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
