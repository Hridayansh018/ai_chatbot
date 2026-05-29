"use client";

import { useEffect, useRef } from "react";
import { marked } from "marked";

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function MessageBubble({ role, content }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (role === "assistant" && contentRef.current) {
      // Add copy buttons to code blocks
      const pres = contentRef.current.querySelectorAll("pre");
      pres.forEach((pre) => {
        if (pre.querySelector(".copy-code-btn")) return;
        const btn = document.createElement("button");
        btn.className = "copy-code-btn";
        btn.textContent = "Copy";
        btn.addEventListener("click", () => {
          const code = pre.querySelector("code");
          navigator.clipboard.writeText(code?.textContent || "");
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy"), 2000);
        });
        pre.style.position = "relative";
        pre.appendChild(btn);
      });
    }
  }, [content, role]);

  if (role === "system") return null;

  const isUser = role === "user";

  return (
    <div className={`message-row ${role}`}>
      <div className="message-avatar">{isUser ? "You" : "AI"}</div>
      <div
        ref={contentRef}
        className="message-content"
        {...(isUser
          ? { children: content }
          : { dangerouslySetInnerHTML: { __html: marked.parse(content || "") } }
        )}
      />
    </div>
  );
}
