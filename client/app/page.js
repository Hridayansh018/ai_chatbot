"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import WelcomeScreen from "./components/WelcomeScreen";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import { sendMessage, getConversation, deleteConversation, listSessions } from "./lib/api";

export default function Home() {
  // ---- State ----
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ---- Scroll to bottom on new messages ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ---- Load sessions on mount ----
  useEffect(() => {
    fetchSessions();
  }, []);

  // ---- Auto-resize textarea ----
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  }, [inputValue]);

  // ---- API calls ----
  const fetchSessions = async () => {
    try {
      const data = await listSessions();
      setSessions(data.sessions || []);
    } catch {
      // Server may not be running yet — ignore
    }
  };

  const loadConversation = async (sessionId) => {
    try {
      const data = await getConversation(sessionId);
      setMessages(data.messages || []);
      setActiveSession(sessionId);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSend = useCallback(
    async (overrideMessage) => {
      const msg = (overrideMessage || inputValue).trim();
      if (!msg || isLoading) return;

      setInputValue("");

      // Optimistic: show user message immediately
      const userMsg = { role: "user", content: msg };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await sendMessage(msg, activeSession);

        // Update session
        setActiveSession(data.session_id);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);

        // Refresh sessions list
        fetchSessions();
      } catch (err) {
        showToast(err.message, "error");
        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [inputValue, isLoading, activeSession]
  );

  const handleDelete = async () => {
    if (!activeSession) return;
    try {
      await deleteConversation(activeSession);
      setShowDeleteModal(false);
      setActiveSession(null);
      setMessages([]);
      showToast("Conversation deleted", "success");
      fetchSessions();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleNewChat = () => {
    setActiveSession(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showToast = (message, type = "") => {
    setToast({ message, type });
  };

  // ---- Filter out system messages for display ----
  const visibleMessages = messages.filter((m) => m.role !== "system");
  const showWelcome = visibleMessages.length === 0 && !isLoading;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={loadConversation}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
      />

      {/* Chat Main Area */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="header-info">
            <h1 className="header-title">
              {activeSession
                ? `Chat ${activeSession.slice(0, 8)}...`
                : "New Conversation"}
            </h1>
          </div>

          {activeSession && (
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
              aria-label="Delete conversation"
              title="Delete this conversation"
            >
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
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          )}
        </header>

        {/* Messages */}
        <div className="messages-container">
          {showWelcome && (
            <WelcomeScreen onSuggestionClick={(prompt) => handleSend(prompt)} />
          )}

          <div className="messages-area">
            {visibleMessages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="typing-indicator">
                <div className="typing-avatar">AI</div>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="input-area">
          <form
            className="input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                className="message-input"
                placeholder="Type your message..."
                rows={1}
                maxLength={10000}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Message input"
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
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
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="input-hint">
              Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new
              line
            </p>
          </form>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}
