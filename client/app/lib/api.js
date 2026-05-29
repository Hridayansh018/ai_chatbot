/**
 * API utility module for the AI Chatbot frontend.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  UPDATE THIS URL to point to your FastAPI backend server.      │
 * │  Default: http://127.0.0.1:8000  (local development)          │
 * │  Production example: https://your-api-domain.com               │
 * └─────────────────────────────────────────────────────────────────┘
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Send a chat message to the backend.
 * @param {string} message - User message
 * @param {string|null} sessionId - Existing session ID (null for new chat)
 * @returns {Promise<{session_id: string, reply: string}>}
 */
export async function sendMessage(message, sessionId) {
  const body = { message };
  if (sessionId) body.session_id = sessionId;

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error (${res.status})`);
  }

  return res.json();
}

/**
 * Get conversation history for a session.
 * @param {string} sessionId
 * @returns {Promise<{session_id: string, messages: Array}>}
 */
export async function getConversation(sessionId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${sessionId}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch conversation`);
  }

  return res.json();
}

/**
 * Delete a conversation session.
 * @param {string} sessionId
 * @returns {Promise<{detail: string}>}
 */
export async function deleteConversation(sessionId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${sessionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to delete session`);
  }

  return res.json();
}

/**
 * List all active session IDs.
 * @returns {Promise<{sessions: string[]}>}
 */
export async function listSessions() {
  const res = await fetch(`${API_BASE_URL}/sessions`);

  if (!res.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return res.json();
}
