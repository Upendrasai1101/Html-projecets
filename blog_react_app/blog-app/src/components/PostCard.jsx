import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";

// ── PostCard Component ────────────────────────────────────────
// Reusable card for displaying a blog post preview
// Uses: React Props, React Router, Material UI Icons,
//       ES6 Arrow Functions, conditional rendering
const PostCard = ({ post, onDelete, onLike, showDelete = false }) => {
  const navigate = useNavigate(); // React Router

  // ES6 Arrow Function — navigate to post detail
  const handleClick = () => navigate(`/blog/${post.id}`);

  // ES6 Arrow Function — format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  // ES6 Arrow Function — truncate long text
  const truncate = (text, limit = 120) =>
    text?.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <article className="post-card" onClick={handleClick}>
      {/* Category Badge */}
      {post.category && (
        <span className="post-card__category">{post.category}</span>
      )}

      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-card__body">{truncate(post.body)}</p>

      <div className="post-card__footer">
        <div className="post-card__meta">
          <span><PersonIcon fontSize="small" /> {post.author || "Anonymous"}</span>
          <span><AccessTimeIcon fontSize="small" /> {formatDate(post.date || new Date())}</span>
        </div>

        <div className="post-card__actions" onClick={(e) => e.stopPropagation()}>
          {/* Likes button */}
          <IconButton
            size="small"
            onClick={() => onLike && onLike(post.id)}
            style={{ color: "#e91e63" }}
          >
            <FavoriteIcon fontSize="small" />
            <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>{post.likes || 0}</span>
          </IconButton>

          {/* Conditional rendering — delete only for post owner */}
          {showDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete && onDelete(post.id)}
              style={{ color: "#f44336" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
