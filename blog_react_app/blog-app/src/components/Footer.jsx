import React from "react";
import { Link } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";

// ── Footer Component ──────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear(); // ES6 Arrow implicit

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <ArticleIcon style={{ color: "#6c63ff", marginRight: "6px" }} />
          <span>Blog-React</span>
        </div>
        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/create">Write</Link>
        </div>
        <p className="footer__copy">© {year} Blog-React. Built with React.</p>
      </div>
    </footer>
  );
};

export default Footer;
