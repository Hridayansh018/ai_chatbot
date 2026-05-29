# AI Chatbot

A full-stack AI chatbot application with a **FastAPI** backend and a **Next.js** frontend, featuring multi-session conversations, model selection, and a premium dark & blue theme.

---

## 📸 Overview

| Feature | Description |
| ------- | ----------- |
| 🤖 Multi-Model AI | Chat with Gemma, DeepSeek, Llama, Qwen, Devstral, and more via OpenRouter |
| 💬 Multi-Session | Create, switch, and manage multiple conversations |
| 🎨 Dark & Blue Theme | Premium glassmorphism UI with smooth animations |
| 📱 Responsive | Optimized for mobile, tablet, and desktop |
| 📝 Markdown Support | AI responses rendered as rich markdown with code copy |
| 🗑️ Session Management | Create, view, and delete conversations |

---

## 🏗️ Project Structure

```
ai_chatbot/
├── server/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── client.py        # OpenRouter client config
│   ├── schema.py        # Pydantic models
│   ├── requirements.txt
│   ├── .env             # API keys (not committed)
│
├── client/              # Next.js frontend
│   ├── app/
│   │   ├── components/  # React components
│   │   ├── lib/api.js   # API utility functions
│   │   ├── constants.js # Model definitions
│   │   ├── globals.css  # Dark & blue theme
│   │   ├── layout.js    # Root layout
│   │   └── page.js      # Main chat page
│   ├── .env.example     # Environment template
│
└── README.md            # This file
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd server

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo OPENROUTER_API_KEY=your_key_here > .env

# Start the server
uvicorn main:app --reload
```

Server runs at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 2. Start the Frontend

```bash
cd client

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env.local

# Start the development server
npm run dev
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## ⚠️ URL Configuration Guide

Here's a quick reference for all URLs you may need to update:

### Server Side

| What | File | Default | When to Change |
| ---- | ---- | ------- | -------------- |
| OpenRouter API Key | `server/.env` | *(required)* | Always — add your key |
| OpenRouter Base URL | `server/client.py` | `https://openrouter.ai/api/v1` | If using a different AI provider |
| CORS Allowed Origins | `server/main.py` | `*` (all origins) | Production — restrict to your frontend domain |
| Server Host/Port | CLI command | `127.0.0.1:8000` | If deploying on a different port or host |

### Client Side

| What | File | Default | When to Change |
| ---- | ---- | ------- | -------------- |
| Backend API URL | `client/.env.local` | `http://127.0.0.1:8000` | When deploying or if server runs on a different port |
| Fallback API URL | `client/app/lib/api.js` | `http://127.0.0.1:8000` | Only if not using `.env.local` |
| AI Model List | `client/app/constants.js` | 5 free models | To add/remove available models |

> **Tip:** For production, set `NEXT_PUBLIC_API_URL` in your hosting provider's environment variables (Vercel, Netlify, etc.) — no code changes needed.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/chat` | Send a message and get an AI reply |
| `GET` | `/conversations/{session_id}` | Retrieve conversation history |
| `DELETE` | `/conversations/{session_id}` | Delete a conversation |
| `GET` | `/sessions` | List all active session IDs |

Full API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Swagger UI)

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Backend | FastAPI, OpenAI SDK, Pydantic, Uvicorn |
| Frontend | Next.js 16, React 19, Vanilla CSS |
| AI Provider | OpenRouter (OpenAI-compatible) |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| Markdown | marked.js |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
