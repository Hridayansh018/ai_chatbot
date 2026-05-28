# AI Chatbot API Documentation

## Overview

This API provides a simple AI chatbot backend using:

* FastAPI
* OpenRouter/OpenAI-compatible models
* Session-based conversation memory

Features:

* Multi-session chat
* Conversation history
* Session management
* Model selection
* Delete chat sessions

---

# Base URL

```text
http://127.0.0.1:8000
```

---

# Authentication

Currently, no authentication is required.

---

# Endpoints

---

# 1. Create Chat Message

## Endpoint

```http
POST /chat
```

## Description

Sends a message to the AI model and continues the conversation using the provided session ID.

If no session ID is provided, a new session is automatically created.

---

## Request Body

```json
{
  "message": "What is Python?",
  "session_id": "optional-session-id",
  "model": "google/gemma-4-26b-a4b-it:free"
}
```

---

## Request Fields

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| message    | string | Yes      | User message             |
| session_id | string | No       | Existing chat session ID |
| model      | string | Yes      | AI model name            |

---

## Example Request

```json
{
  "message": "Explain REST APIs",
  "model": "deepseek/deepseek-chat"
}
```

---

## Example Response

```json
{
  "session_id": "a1b2c3d4",
  "reply": "REST APIs allow applications to communicate over HTTP."
}
```

---

## Response Fields

| Field      | Type   | Description             |
| ---------- | ------ | ----------------------- |
| session_id | string | Chat session identifier |
| reply      | string | AI-generated response   |

---

# 2. Get Conversation History

## Endpoint

```http
GET /conversations/{session_id}
```

## Description

Retrieves the complete conversation history for a session.

---

## Path Parameters

| Parameter  | Type   | Description     |
| ---------- | ------ | --------------- |
| session_id | string | Chat session ID |

---

## Example Request

```http
GET /conversations/a1b2c3d4
```

---

## Example Response

```json
{
  "session_id": "a1b2c3d4",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "What is Python?"
    },
    {
      "role": "assistant",
      "content": "Python is a programming language."
    }
  ]
}
```

---

# 3. Delete Conversation

## Endpoint

```http
DELETE /conversations/{session_id}
```

## Description

Deletes a conversation session and all associated messages.

---

## Path Parameters

| Parameter  | Type   | Description     |
| ---------- | ------ | --------------- |
| session_id | string | Chat session ID |

---

## Example Request

```http
DELETE /conversations/a1b2c3d4
```

---

## Example Response

```json
{
  "detail": "Session deleted"
}
```

---

# 4. List All Sessions

## Endpoint

```http
GET /sessions
```

## Description

Returns all active conversation session IDs.

---

## Example Request

```http
GET /sessions
```

---

## Example Response

```json
{
  "sessions": [
    "a1b2c3d4",
    "e5f6g7h8"
  ]
}
```

---

# Conversation Memory Flow

```text
Frontend
    ↓
POST /chat
    ↓
Backend loads session history
    ↓
AI generates response
    ↓
Conversation stored in memory
```

---

# Session Lifecycle

## New Session

If `session_id` is not provided:

```json
{
  "message": "Hello",
  "model": "deepseek/deepseek-chat"
}
```

Backend automatically creates a new session ID.

---

## Existing Session

To continue an existing conversation:

```json
{
  "message": "Explain FastAPI",
  "session_id": "a1b2c3d4",
  "model": "deepseek/deepseek-chat"
}
```

---

# Supported AI Models

Examples:

```text
deepseek/deepseek-chat
google/gemma-4-26b-a4b-it:free
meta-llama/llama-3.1-8b-instruct:free
qwen/qwen-2.5-72b-instruct:free
```

Browse available models:

https://openrouter.ai/models

---

# Error Responses

## Session Not Found

```json
{
  "detail": "Session not found"
}
```

Status Code:

```text
404
```

---

## AI Provider Error

```json
{
  "detail": "Provider returned an error"
}
```

Status Code:

```text
500
```

---

# Current Limitations

Conversation memory is currently stored in RAM:

```python
conversations = {}
```

This means:

* conversations are lost after server restart
* memory is not shared across servers
* not suitable for production scaling

---

# Recommended Production Improvements

* PostgreSQL for persistent chat storage
* Redis for fast conversation memory
* User authentication
* Streaming responses
* Rate limiting
* Token usage tracking
* WebSocket/SSE support

---

# Running the API

## Start Server

```bash
uvicorn main:app --reload
```

---

# Interactive Swagger Docs

Open:

```text
http://127.0.0.1:8000/docs
```

---

# Tech Stack

* FastAPI
* OpenRouter
* OpenAI Python SDK
* Pydantic
* UUID session management
* CORS middleware
