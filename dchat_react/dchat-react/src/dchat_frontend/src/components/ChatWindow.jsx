import React, { useEffect, useRef } from "react";
import Message from "./Message";

// ── ChatWindow Component ──────────────────────────────────────
// Props: messages, currentUser, isLoading
const ChatWindow = ({ messages, currentUser, isLoading }) => {
  const bottomRef = useRef(null); // useRef — auto scroll to bottom

  // useEffect — scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {/* Conditional rendering — loading, empty, or messages */}
      {isLoading ? (
        <div className="chat-loading">
          <div className="spinner"></div>
          <p>Loading messages from blockchain...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-chat">
          <p>🌟 No messages yet!</p>
          <p>Be the first to say hello on the blockchain!</p>
        </div>
      ) : (
        <div className="messages">
          {/* ES6 Map — render each message */}
          {messages.map((msg) => (
            <Message
              key={Number(msg.id)}
              message={msg}
              isMe={msg.username === currentUser}
            />
          ))}
          {/* useRef anchor for auto scroll */}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
