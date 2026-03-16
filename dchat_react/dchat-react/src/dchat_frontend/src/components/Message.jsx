import React from "react";

// ── Avatar colors ─────────────────────────────────────────────
const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#c77dff", "#ff9a3c", "#00b4d8", "#f72585"
];

// ES6 Arrow Functions ──────────────────────────────────────────
const getColor    = (name) => COLORS[name.charCodeAt(0) % COLORS.length];
const getInitials = (name) => name.substring(0, 2).toUpperCase();
const formatTime  = (ns)   => {
  const date = new Date(Number(ns) / 1000000);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// ── Message Component ─────────────────────────────────────────
// Props: message, isMe
const Message = ({ message, isMe }) => {
  const color    = getColor(message.username);
  const initials = getInitials(message.username);
  const time     = formatTime(message.time);

  return (
    <div className={`message ${isMe ? "message--me" : "message--other"}`}>
      {/* Conditional rendering — avatar position based on isMe */}
      {!isMe && (
        <div className="message__avatar" style={{ background: color }}>
          {initials}
        </div>
      )}

      <div className="message__bubble">
        {/* Conditional rendering — show username only for others */}
        {!isMe && (
          <p className="message__username" style={{ color }}>{message.username}</p>
        )}
        <p className="message__text">{message.content}</p>
        <span className="message__time">{time}</span>
      </div>

      {isMe && (
        <div className="message__avatar message__avatar--me" style={{ background: color }}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default Message;
