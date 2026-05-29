"use client";

import { useEffect } from "react";

export default function Toast({ message, type = "", onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast show ${type}`}>
      {message}
    </div>
  );
}
