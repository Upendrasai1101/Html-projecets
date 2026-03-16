// ============================================================
// dChat — main.mo
// Decentralized Chat App on Internet Computer
// Features: send messages, get messages, username support
// ============================================================

import Time   "mo:base/Time";
import Array  "mo:base/Array";
import Text   "mo:base/Text";

persistent actor dChat {

  // ── Message Type ──────────────────────────────────────────
  type Message = {
    id       : Nat;
    username : Text;
    content  : Text;
    time     : Int;
  };

  // ── State ─────────────────────────────────────────────────
  var messages : [Message] = [];
  var nextId   : Nat       = 0;

  // ── Send Message ──────────────────────────────────────────
  public func sendMessage(username : Text, content : Text) : async () {
    let newMessage : Message = {
      id       = nextId;
      username = username;
      content  = content;
      time     = Time.now();
    };
    messages := Array.append(messages, [newMessage]);
    nextId   += 1;
  };

  // ── Get All Messages ──────────────────────────────────────
  public query func getMessages() : async [Message] {
    return messages;
  };

  // ── Get Message Count ─────────────────────────────────────
  public query func getMessageCount() : async Nat {
    return messages.size();
  };

  // ── Clear All Messages (admin) ────────────────────────────
  public func clearMessages() : async () {
    messages := [];
    nextId   := 0;
  };

};
