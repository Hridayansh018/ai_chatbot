from pydantic import BaseModel


class ChatRequest(BaseModel):
    message:str
    session_id:str | None = None
    model:str = "google/gemma-4-26b-a4b-it:free"


class ChatResponse(BaseModel):
    session_id:str
    reply:str

