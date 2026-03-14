import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";

// ── App Component ─────────────────────────────────────────────
// Main component — manages all notes state
const App = () => {
  // useState — stores all notes as an array
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome to Keeper! 👋",
      content: "Click the + button to add your first note. Double click a note to delete it!"
    },
    {
      id: 2,
      title: "React Tips 💡",
      content: "This app uses React Props, ES6 Arrow Functions, ES6 Map, useState, Material UI and conditional rendering!"
    },
    {
      id: 3,
      title: "Shopping List 🛒",
      content: "Milk, Eggs, Bread, Coffee, Fruits"
    }
  ]);

  // ES6 Arrow Function — add new note using spread operator
  const addNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, { ...newNote, id: Date.now() }]);
  };

  // ES6 Arrow Function — delete note by id
  const deleteNote = (id) => {
    // ES6 Arrow Function inside filter
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="app-wrapper">
      {/* Header — receives no props, standalone component */}
      <Header />

      <main className="main-content">
        {/* CreateArea — receives addNote as prop */}
        <CreateArea onAdd={addNote} />

        {/* ES6 Map — render each note as a Note component */}
        {/* Conditional rendering — show empty state if no notes */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>✨ No notes yet! Add your first note above.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              // Note — receives props: id, title, content, onDelete
              <Note
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer — receives notes count as prop */}
      <Footer noteCount={notes.length} />
    </div>
  );
};

export default App;
