import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

// ── BlogDetail Page ───────────────────────────────────────────
// Uses: useParams (React Router), useEffect, useState,
//       useRef, axios, conditional rendering
const BlogDetail = () => {
  const { id }       = useParams();    // React Router — get id from URL
  const navigate     = useNavigate();  // React Router
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [likes,   setLikes]   = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // useRef — auto focus comment input
  const commentRef = useRef(null);

  // useEffect — fetch post by id when component mounts or id changes
  useEffect(() => {
    setLoading(true);

    // Check localStorage first (user-created posts)
    const localPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const localPost  = localPosts.find((p) => String(p.id) === String(id));

    if (localPost) {
      setPost(localPost);
      setLikes(localPost.likes || 0);
      setLoading(false);
    } else {
      // axios — fetch from API
      axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((res) => {
          setPost({ ...res.data, author: "API Author", date: new Date().toISOString() });
          setLikes(Math.floor(Math.random() * 50));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }

    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]); // re-fetch when id changes

  // ES6 Arrow Function — add comment, useRef to focus
  const addComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: comment, author: "You", date: new Date().toLocaleDateString() }
    ]);
    setComment("");
    // useRef — focus back to input after submit
    commentRef.current?.focus();
  };

  // Conditional rendering — loading state
  if (loading) return (
    <div className="loading-state">
      <CircularProgress style={{ color: "#6c63ff" }} />
    </div>
  );

  // Conditional rendering — error state
  if (error) return (
    <div className="error-state">
      <p>❌ {error}</p>
      <button className="btn btn--primary" onClick={() => navigate("/blog")}>Go Back</button>
    </div>
  );

  return (
    <div className="blog-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="small" /> Back
      </button>

      <article className="blog-detail__article">
        {post?.category && <span className="post-card__category">{post.category}</span>}
        <h1 className="blog-detail__title">{post?.title}</h1>

        <div className="blog-detail__meta">
          <span>✍️ {post?.author || "Anonymous"}</span>
          <span>📅 {new Date(post?.date || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>

        <div className="blog-detail__body">
          <p>{post?.body}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>

        {/* Like Button */}
        <div className="blog-detail__likes">
          <IconButton onClick={() => setLikes((l) => l + 1)} style={{ color: "#e91e63" }}>
            <FavoriteIcon />
          </IconButton>
          <span>{likes} likes</span>
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments">
        <h3>Comments ({comments.length})</h3>

        {/* Comment Form — useRef */}
        <form className="comment-form" onSubmit={addComment}>
          <input
            ref={commentRef}  // useRef attached here
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
          />
          <button type="submit" className="btn btn--primary">Post</button>
        </form>

        {/* ES6 Map — render comments */}
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          <div className="comments__list">
            {comments.map((c) => (
              <div key={c.id} className="comment-card">
                <div className="comment-card__header">
                  <strong>{c.author}</strong>
                  <span>{c.date}</span>
                </div>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogDetail;
