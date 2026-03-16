import React, { useState, useEffect, useRef } from "react";
import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import { idlFactory } from "../../../declarations/dchat_backend/dchat_backend.did.js";
import Header from "./components/Header";
import UsernameSetup from "./components/UsernameSetup";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

// ── Setup canister ────────────────────────────────────────────
const canisterId = process.env.CANISTER_ID_DCHAT_BACKEND;
const agent      = new HttpAgent({ host: "http://127.0.0.1:8080" });
agent.fetchRootKey();
const dchat = Actor.createActor(idlFactory, { agent, canisterId });

// ── App Component ─────────────────────────────────────────────
const App = () => {
  // useState — manage all app state
  const [messages,    setMessages]    = useState([]);
  const [username,    setUsername]    = useState(localStorage.getItem("dchat_user") || "");
  const [isLoading,   setIsLoading]   = useState(true);
  const [isSending,   setIsSending]   = useState(false);
  const lastCountRef                  = useRef(0);

  // useEffect — load messages on mount + poll every 3s
  useEffect(() => {
    loadMessages();
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  // ES6 Arrow Function — load all messages
  const loadMessages = async () => {
    try {
      const msgs = await dchat.getMessages();
      setMessages(msgs);
      lastCountRef.current = msgs.length;
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ES6 Arrow Function — poll for new messages
  const pollMessages = async () => {
    try {
      const count = await dchat.getMessageCount();
      if (Number(count) > lastCountRef.current) {
        await loadMessages();
      }
    } catch (err) {
      console.error("Poll error:", err);
    }
  };

  // ES6 Arrow Function — send message
  const sendMessage = async (content) => {
    if (!content.trim() || !username) return;
    setIsSending(true);
    try {
      await dchat.sendMessage(username, content);
      await loadMessages();
    } catch (err) {
      console.error("Error sending:", err);
    } finally {
      setIsSending(false);
    }
  };

  // ES6 Arrow Function — set username
  const handleSetUsername = (name) => {
    setUsername(name);
    localStorage.setItem("dchat_user", name);
  };

  // ES6 Arrow Function — clear username
  const handleClearUsername = () => {
    setUsername("");
    localStorage.removeItem("dchat_user");
  };

  return (
    <div className="app">
      {/* Header — props: messageCount */}
      <Header messageCount={messages.length} />

      <main className="main">
        {/* Conditional rendering — show setup or active user */}
        {!username ? (
          <UsernameSetup onSet={handleSetUsername} />
        ) : (
          <div className="active-user">
            <span>👤 Chatting as: <strong className="active-user__name">{username}</strong></span>
            <button className="btn btn--change" onClick={handleClearUsername}>Change</button>
          </div>
        )}

        {/* ChatWindow — props: messages, username, isLoading */}
        <ChatWindow
          messages={messages}
          currentUser={username}
          isLoading={isLoading}
        />

        {/* MessageInput — props: onSend, isSending, disabled */}
        <MessageInput
          onSend={sendMessage}
          isSending={isSending}
          disabled={!username}
        />
      </main>

      <footer className="footer">
        <p>💬 dChat React — Decentralized messaging on <strong>Internet Computer</strong></p>
      </footer>
    </div>
  );
};

export default App;
