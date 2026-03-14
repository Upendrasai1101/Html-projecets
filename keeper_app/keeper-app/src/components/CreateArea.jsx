import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

// ── CreateArea Component ──────────────────────────────────────
// Handles creating new notes
// Uses: useState, conditional rendering (zoom animation),
//       Material UI Fab, Zoom, ES6 Arrow Functions, React Props
const CreateArea = ({ onAdd }) => {
  // useState — controls whether input area is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // useState — stores the new note being typed
  const [note, setNote] = useState({ title: "", content: "" });

  // ES6 Arrow Function — expand the textarea on click
  const handleExpand = () => {
    setIsExpanded(true);
  };

  // ES6 Arrow Function — handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    // ES6 Spread — update only the changed field
    setNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  // ES6 Arrow Function — submit the note
  const submitNote = (event) => {
    event.preventDefault();
    if (!note.content.trim()) return; // don't add empty notes
    onAdd(note);                      // pass note up to App via prop
    setNote({ title: "", content: "" }); // reset form
    setIsExpanded(false);             // collapse back
  };

  return (
    <div className="create-area">
      <form className="create-form" onSubmit={submitNote}>

        {/* Conditional Rendering — title only shown when expanded */}
        {isExpanded && (
          <input
            className="create-form__title"
            name="title"
            value={note.title}
            onChange={handleChange}
            placeholder="Title"
            autoFocus
          />
        )}

        <textarea
          className="create-form__content"
          name="content"
          value={note.content}
          onChange={handleChange}
          onClick={handleExpand}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1} // conditional rendering — expand rows
        />

        {/* Material UI Zoom — conditional animation for Add button */}
        <Zoom in={isExpanded}>
          <Fab
            type="submit"
            size="small"
            style={{
              position: "absolute",
              right: "18px",
              bottom: "-20px",
              background: "#f9d835",
              color: "#202124",
              boxShadow: "0 4px 12px rgba(249,216,53,0.4)"
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>

      </form>
    </div>
  );
};

export default CreateArea;
