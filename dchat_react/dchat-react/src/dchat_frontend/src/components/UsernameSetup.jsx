import React, { useState, useRef, useEffect } from "react";

// ── UsernameSetup Component ───────────────────────────────────
// Props: onSet
const UsernameSetup = ({ onSet }) => {
  const [value, setValue] = useState("");
  const inputRef          = useRef(null); // useRef — auto focus

  // useEffect — focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ES6 Arrow Function — handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSet(value.trim());
  };

  return (
    <div className="username-bar">
      <span className="username-bar__label">👤 Your Name:</span>
      <form onSubmit={handleSubmit} className="username-form">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your username..."
          maxLength={20}
          className="username-input"
        />
        <button type="submit" className="btn btn--set">Set Name</button>
      </form>
    </div>
  );
};

export default UsernameSetup;
