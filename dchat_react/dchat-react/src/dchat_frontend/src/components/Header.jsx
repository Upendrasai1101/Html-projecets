import React from "react";

// ── Header Component ──────────────────────────────────────────
// Props: messageCount
const Header = ({ messageCount }) => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <span>💬</span>
          <span>dChat React</span>
        </div>
        <div className="header__meta">
          <span className="header__badge">⛓️ On-Chain</span>
          {/* Conditional rendering — show count only if messages exist */}
          {messageCount > 0 && (
            <span className="header__count">{messageCount} messages</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
