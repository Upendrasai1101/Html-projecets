import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Zoom from "@mui/material/Zoom";

// ── Note Component ────────────────────────────────────────────
// Displays a single note card
// Uses: React Props, Material UI (DeleteIcon, IconButton, Zoom),
//       useState for hover, conditional rendering, ES6 Arrow Functions,
//       inline styles, zoom in/out animations
const Note = ({ id, title, content, onDelete }) => {
  // useState — tracks hover state for delete button visibility
  const [isHovered, setIsHovered] = useState(false);

  // ES6 Arrow Function — handle delete click, passes id up via prop
  const handleDelete = () => {
    onDelete(id);
  };

  // Note color palette — random pastel color per note
  const colors = [
    "#fff9c4", // yellow
    "#d7aefb", // purple
    "#a8d8ea", // blue
    "#fdcfe8", // pink
    "#ccff90", // green
    "#e6c9a8", // brown
    "#d4e157", // lime
    "#80cbc4", // teal
  ];

  // ES6 Arrow Function — pick color based on note id
  const getNoteColor = () => colors[id % colors.length];

  return (
    // Zoom in animation — MUI Zoom wraps the whole card
    <Zoom in={true} timeout={300}>
      <div
        className="note"
        style={{ backgroundColor: getNoteColor() }} // inline style — dynamic color
        onMouseEnter={() => setIsHovered(true)}   // conditional rendering trigger
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Note Title — received via props */}
        {title && (
          <h2
            className="note__title"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "1.2rem",
              fontWeight: 600,
              marginBottom: "8px",
              color: "#202124"
            }}
          >
            {title}
          </h2>
        )}

        {/* Note Content — received via props */}
        <p
          className="note__content"
          style={{
            fontSize: "0.95rem",
            color: "#3c3c3c",
            lineHeight: 1.6,
            flex: 1
          }}
        >
          {content}
        </p>

        {/* Conditional Rendering — delete button only shown on hover */}
        <div
          className="note__footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            opacity: isHovered ? 1 : 0,       // conditional rendering via opacity
            transition: "opacity 0.2s ease",   // smooth fade animation
          }}
        >
          {/* Material UI IconButton + DeleteIcon */}
          <IconButton
            onClick={handleDelete}
            size="small"
            style={{ color: "#5f6368" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </Zoom>
  );
};

export default Note;
