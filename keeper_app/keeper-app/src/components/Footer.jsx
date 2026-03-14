import React from "react";

// ── Footer Component ──────────────────────────────────────────
// Receives noteCount as prop — conditional rendering for plural
// Uses: React Props, conditional rendering, ES6 arrow function
const Footer = ({ noteCount }) => {
  // ES6 Arrow Function — get current year
  const getYear = () => new Date().getFullYear();

  return (
    <footer className="footer">
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        {/* Conditional rendering — singular vs plural */}
        {noteCount === 0
          ? "No notes yet"
          : `${noteCount} note${noteCount !== 1 ? "s" : ""} saved`}
        {" "}&nbsp;•&nbsp; Copyright © {getYear()} Keeper
      </p>
    </footer>
  );
};

export default Footer;
