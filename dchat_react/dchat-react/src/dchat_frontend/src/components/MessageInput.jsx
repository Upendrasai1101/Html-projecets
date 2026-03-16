import React, { useState, useRef } from "react";

// ── MessageInput Component ────────────────────────────────────
// Props: onSend, isSending, disabled
const MessageInput = ({ onSend, isSending, disabled }) => {
  const [value, setValue] = useState("");
  const inputRef          = useRef(null); // useRef — refocus after send

  // ES6 Arrow Function — handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    await onSend(value.trim());
    setValue("");
    inputRef.current?.focus(); // useRef — focus back after send
  };

  return (
    <div className="message-input-area">
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={disabled ? "Set username to chat..." : "Type a message..."}
          maxLength={200}
          disabled={disabled}
          className="message-input"
        />
        <button
          type="submit"
          disabled={disabled || isSending || !value.trim()}
          className="btn btn--send"
        >
          {/* Conditional rendering — button text */}
          {isSending ? "Sending..." : "Send 🚀"}
        </button>
      </form>
      {/* Conditional rendering — hint message */}
      {disabled && (
        <p className="input-hint">Set your username above to start chatting!</p>
      )}
    </div>
  );
};

export default MessageInput;
