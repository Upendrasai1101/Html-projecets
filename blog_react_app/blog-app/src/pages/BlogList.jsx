import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import postsReducer, { ACTIONS, initialState } from "../utils/postsReducer";
import { useLocalStorage } from "../hooks/useCustomHooks";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

// ── BlogList Page ─────────────────────────────────────────────
// Uses: useEffect, useReducer, axios, useState,
//       Custom Hook (useLocalStorage), ES6 Map, conditional rendering
const BlogList = () => {
  // useReducer — complex state for posts (loading, error, data)
  const [state, dispatch] = useReducer(postsReducer, initialState);

  // useState — search and filter
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  // Custom Hook — get user-created posts from localStorage
  const [localPosts] = useLocalStorage("blogPosts", []);

  const categories = ["All", "Technology", "Lifestyle", "Travel", "Food", "Health"];

  // useEffect — fetch posts from API when component mounts
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    // axios — API call to JSONPlaceholder
    axios.get("https://jsonplaceholder.typicode.com/posts?_limit=12")
      .then((response) => {
        // ES6 Map — transform API data to our format
        const apiPosts = response.data.map((post) => ({
          ...post,
          author:   "API Author",
          date:     new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
          likes:    Math.floor(Math.random() * 50),
        }));

        // ES6 Spread — merge local posts + API posts
        dispatch({ type: ACTIONS.SET_POSTS, payload: [...localPosts, ...apiPosts] });
      })
      .catch((err) => {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      });
  }, []); // runs once on mount

  // ES6 Arrow Function — handle like
  const handleLike = (id) => dispatch({ type: ACTIONS.LIKE_POST, payload: id });

  // ES6 Arrow Function — filter posts by search + category
  const filteredPosts = state.posts.filter((post) => {
    const matchSearch   = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || post.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="blog-list">
      <div className="blog-list__header">
        <h1>All Posts</h1>
        <p>{state.posts.length} articles published</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <SearchIcon className="search-bar__icon" />
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // ES6 Arrow Function
        />
      </div>

      {/* Category Filter — ES6 Map */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? "category-btn--active" : ""}`}
            onClick={() => setCategory(cat)} // ES6 Arrow Function
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conditional Rendering — loading, error, empty, posts */}
      {state.loading ? (
        <div className="loading-state">
          <CircularProgress style={{ color: "#6c63ff" }} />
          <p>Loading posts...</p>
        </div>
      ) : state.error ? (
        <div className="error-state">
          <p>❌ Error: {state.error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found. Try a different search!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {/* ES6 Map — render PostCard for each post */}
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
