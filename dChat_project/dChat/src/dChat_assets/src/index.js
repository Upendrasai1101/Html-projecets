// ============================================================
// dChat — index.js
// Frontend JS connecting to Motoko canister
// ============================================================

import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import { idlFactory } from "../../declarations/dChat/dChat.did.js";

// ── Setup canister connection ─────────────────────────────────
const canisterId = process.env.CANISTER_ID_DCHAT;

const agent = new HttpAgent({ host: "http://127.0.0.1:8080" });
agent.fetchRootKey(); // local development only

const dChat = Actor.createActor(idlFactory, { agent, canisterId });

// ── State ─────────────────────────────────────────────────────
let currentUser = localStorage.getItem("dchat_username") || null;
let lastMessageCount = 0;

// ── Avatar Colors ─────────────────────────────────────────────
const avatarColors = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#c77dff", "#ff9a3c", "#00b4d8", "#f72585"
];

const getAvatarColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (username) => username.substring(0, 2).toUpperCase();

// ── Format Time ───────────────────────────────────────────────
const formatTime = (nanoseconds) => {
  const ms   = Number(nanoseconds) / 1000000;
  const date = new Date(ms);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// ── Render Messages ───────────────────────────────────────────
const renderMessages = (messages) => {
  const container = document.getElementById("messages");
  const loading   = document.getElementById("chat-loading");

  loading.style.display = "none";

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty-chat">
        <p>🌟 No messages yet!</p>
        <p>Be the first to say hello on the blockchain!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages.map((msg) => {
    const isMe      = msg.username === currentUser;
    const color     = getAvatarColor(msg.username);
    const initials  = getInitials(msg.username);
    const timeStr   = formatTime(msg.time);

    return `
      <div class="message ${isMe ? "message--me" : "message--other"}">
        ${!isMe ? `
          <div class="message__avatar" style="background: ${color}">
            ${initials}
          </div>
        ` : ""}
        <div class="message__bubble">
          ${!isMe ? `<p class="message__username" style="color: ${color}">${msg.username}</p>` : ""}
          <p class="message__text">${msg.content}</p>
          <span class="message__time">${timeStr}</span>
        </div>
        ${isMe ? `
          <div class="message__avatar message__avatar--me" style="background: ${color}">
            ${initials}
          </div>
        ` : ""}
      </div>
    `;
  }).join("");

  // Auto scroll to bottom
  const chatWindow = document.getElementById("chat-window");
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Update message count
  document.getElementById("msg-count").textContent = `${messages.length} messages`;
  lastMessageCount = messages.length;
};

// ── Load Messages ─────────────────────────────────────────────
const loadMessages = async () => {
  try {
    const messages = await dChat.getMessages();
    renderMessages(messages);
  } catch (err) {
    console.error("Error loading messages:", err);
  }
};

// ── Poll for new messages every 3 seconds ─────────────────────
const startPolling = () => {
  setInterval(async () => {
    const count = await dChat.getMessageCount();
    if (Number(count) > lastMessageCount) {
      await loadMessages();
    }
  }, 3000);
};

// ── Username Setup ────────────────────────────────────────────
const updateUIForUser = () => {
  if (currentUser) {
    document.getElementById("username-bar").style.display  = "none";
    document.getElementById("active-user").style.display   = "flex";
    document.getElementById("active-username").textContent = currentUser;
    document.getElementById("message-input").disabled      = false;
    document.getElementById("send-btn").disabled           = false;
    document.getElementById("input-hint").style.display    = "none";
  } else {
    document.getElementById("username-bar").style.display  = "flex";
    document.getElementById("active-user").style.display   = "none";
    document.getElementById("message-input").disabled      = true;
    document.getElementById("send-btn").disabled           = true;
    document.getElementById("input-hint").style.display    = "block";
  }
};

document.getElementById("set-username-btn").addEventListener("click", () => {
  const input = document.getElementById("username-input").value.trim();
  if (!input) return;
  currentUser = input;
  localStorage.setItem("dchat_username", currentUser);
  updateUIForUser();
});

document.getElementById("username-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("set-username-btn").click();
});

document.getElementById("change-username-btn").addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("dchat_username");
  document.getElementById("username-input").value = "";
  updateUIForUser();
});

// ── Send Message ──────────────────────────────────────────────
document.getElementById("message-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input   = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const content = input.value.trim();

  if (!content || !currentUser) return;

  sendBtn.disabled    = true;
  sendBtn.textContent = "Sending...";

  try {
    await dChat.sendMessage(currentUser, content);
    input.value = "";
    await loadMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  } finally {
    sendBtn.disabled    = false;
    sendBtn.textContent = "Send 🚀";
    input.focus();
  }
});

// ── Initialize ────────────────────────────────────────────────
window.addEventListener("load", async () => {
  updateUIForUser();
  await loadMessages();
  startPolling();
});
