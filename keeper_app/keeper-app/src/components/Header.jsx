import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";

// ── Header Component ──────────────────────────────────────────
// Displays app title with Material UI icon
// Uses: Material UI Icon, inline styles
const Header = () => {
  return (
    <header className="header">
      <div className="header__inner">
        {/* Material UI Icon */}
        <HighlightIcon
          style={{
            color: "#f9d835",
            fontSize: "2rem",
            marginRight: "8px",
            verticalAlign: "middle"
          }}
        />
        <h1
          style={{
            display: "inline",
            fontFamily: "'Caveat', cursive",
            fontSize: "2.2rem",
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: "1px"
          }}
        >
          Keeper
        </h1>
      </div>
    </header>
  );
};

export default Header;
