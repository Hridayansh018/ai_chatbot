from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from client import client
import schema
import uuid


app = FastAPI(title="AI Chatbot API")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

conversations: dict[str,list[dict]] = {}

SYSTEM_PROMPT = {"role": "system", "content": "You are a helpful assistant. Answer the user's questions to the best of your ability."}


@app.post("/chat", response_model=schema.ChatResponse)
def chat(request: schema.ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    history = conversations.get(session_id, [SYSTEM_PROMPT])
    history.append({"role":"user","content":request.message})
    try:
        completion = client.chat.completions.create(
            model = request.model,
            messages = history,
            temperature = 0.7,
            max_tokens = 2048
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    reply = completion.choices[0].message.content
    history.append({"role":"assistant","content":reply})

    conversations[session_id] = history
    return schema.ChatResponse(session_id = session_id, reply = reply)


@app.get("/conversations/{session_id}")
def get_history(session_id:str):
    history = conversations.get(session_id)
    if session_id not in conversations:
        raise HTTPException(status_code=404, detail="Session not found")
    return{"session_id": session_id, "messages":conversations[session_id]}


@app.delete("/conversations/{session_id}")
def delete_history(session_id:str):
    if session_id not in conversations:
        raise HTTPException(status_code=404, detail="Session not found")
    del conversations[session_id]
    return {"detail": "Session deleted"}

@app.get("/sessions")
def list_sessions():
    return{"sessions": list(conversations.keys())}

