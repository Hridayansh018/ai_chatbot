"use client";

// import { MODELS } from "../constants";

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
  selectedModel,
  onModelChange,
}) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="logo-text">AI Chat</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>

        {/* Sessions List */}
        <div className="sessions-label">Conversations</div>
        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="sessions-empty">
              No conversations yet.
              <br />
              Start a new chat!
            </div>
          ) : (
            sessions.map((id) => (
              <button
                key={id}
                className={`session-item ${activeSession === id ? "active" : ""}`}
                onClick={() => {
                  onSelectSession(id);
                  onClose();
                }}
              >
                <span className="session-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span className="session-label">{id.slice(0, 8)}...</span>
              </button>
            ))
          )}
        </div>

        {/* Model Selector */}
        {/* <div className="sidebar-footer">
          <div className="model-selector">
            <label htmlFor="modelSelect" className="model-label">
              Model
            </label>
            <select
              id="modelSelect"
              className="model-select"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div> */}
      </aside>
    </>
  );
}
