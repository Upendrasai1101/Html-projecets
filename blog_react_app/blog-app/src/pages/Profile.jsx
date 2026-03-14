import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useCustomHooks";
import PostCard from "../components/PostCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ArticleIcon from "@mui/icons-material/Article";

// ── Profile Page ──────────────────────────────────────────────
// Uses: Context API (useAuth), Custom Hook (useLocalStorage),
//       React Router, ES6 Map, conditional rendering, ES6 Arrow Functions
const Profile = () => {
  const { user, logout }         = useAuth();  // Context API
  const navigate                 = useNavigate();
  const [posts, setPosts]        = useLocalStorage("blogPosts", []); // Custom Hook

  // ES6 Arrow Function — filter user's posts
  const myPosts = posts.filter((post) => post.author === user?.name);

  // ES6 Arrow Function — delete post
  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id)); // ES6 Arrow Function
  };

  // ES6 Arrow Function — handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <div className="profile-card">
        <AccountCircleIcon style={{ fontSize: "5rem", color: "#6c63ff" }} />
        <div className="profile-card__info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <p className="profile-card__joined">
            Member since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          <LogoutIcon fontSize="small" /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <ArticleIcon style={{ color: "#6c63ff" }} />
          <span className="stat-card__number">{myPosts.length}</span>
          <span className="stat-card__label">Posts Written</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__number">
            {myPosts.reduce((sum, p) => sum + (p.likes || 0), 0)}
          </span>
          <span className="stat-card__label">Total Likes</span>
        </div>
      </div>

      {/* My Posts */}
      <div className="profile-posts">
        <h2>My Posts</h2>

        {/* Conditional rendering — empty state */}
        {myPosts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't written any posts yet.</p>
            <button className="btn btn--primary" onClick={() => navigate("/create")}>
              Write Your First Post
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {/* ES6 Map — render user's posts */}
            {myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                showDelete={true} // conditional rendering prop
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
