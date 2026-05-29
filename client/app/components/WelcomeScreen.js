"use client";

const SUGGESTIONS = [
  { label: "Explain REST APIs", prompt: "Explain how REST APIs work" },
  {
    label: "Python sort function",
    prompt: "Write a Python function to sort a list",
  },
  {
    label: "Web dev best practices",
    prompt: "What are the best practices for web development?",
  },
  {
    label: "Brainstorm startup ideas",
    prompt: "Help me brainstorm startup ideas",
  },
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#welcomeGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient
              id="welcomeGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "#3b82f6" }} />
              <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
            </linearGradient>
          </defs>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className="welcome-title">How can I help you today?</h2>
      <p className="welcome-subtitle">
        Start a conversation with AI. Ask questions, brainstorm ideas, or get
        help with code.
      </p>
      <div className="welcome-chips">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.prompt}
            className="chip"
            onClick={() => onSuggestionClick(s.prompt)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
