import os

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from starlette.concurrency import run_in_threadpool

from app.rag_service import (
    DocumentDeletionError,
    DocumentProcessingError,
    LLMServiceError,
    answer_question,
    clear_all_documents,
    delete_document,
    ingest_pdf,
)

app = FastAPI(
    title="GEKA API",
    description="Grounded Enterprise Knowledge Assistant API",
    version="1.0.0",
)

# 1. CONFIGURE CORS (Cross-Origin Resource Sharing)
# This allows your Vite frontend to securely talk to your FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vite local server port
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)


# 2. DEFINE DATA MODELS (Pydantic)
class ChatRequest(BaseModel):
    message: str
    history: list[dict] = Field(default_factory=list)

    @field_validator("message")
    @classmethod
    def validate_message(cls, message: str) -> str:
        message = message.strip()
        if not message:
            raise ValueError("Message must not be blank")
        return message


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict[str, str | int]]


class DocumentListResponse(BaseModel):
    documents: list[dict[str, str | int]]


# 3. CORE ENDPOINTS


@app.get("/")
def root():
    return {"message": "GEKA API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/documents", response_model=DocumentListResponse)
async def get_documents():
    from app.chroma_store import list_documents

    return {"documents": await run_in_threadpool(list_documents)}


@app.delete("/api/document")
async def remove_document(filename: str):
    try:
        removed = await run_in_threadpool(delete_document, filename)
    except DocumentDeletionError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not removed:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"status": "deleted", "filename": filename}


@app.delete("/api/documents")
async def remove_all_documents():
    try:
        count = await run_in_threadpool(clear_all_documents)
    except DocumentDeletionError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
    return {"status": "cleared", "documents_deleted": count}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_interaction(request: ChatRequest):
    """
    Retrieves evidence and generates a grounded answer through Ollama.
    """
    try:
        result = await run_in_threadpool(
            answer_question, request.message, request.history
        )
        return ChatResponse(**result)
    except LLMServiceError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    relative_path: str | None = Form(default=None),
):
    """
    Handles file drops or file selections from your document pipeline.
    """
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported.")

    try:
        max_bytes = int(os.getenv("GEKA_MAX_UPLOAD_BYTES", str(25 * 1024 * 1024)))
        contents = await file.read(max_bytes + 1)
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=413, detail="PDF exceeds the 25 MB upload limit."
            )
        return await run_in_threadpool(ingest_pdf, filename, contents, relative_path)
    except DocumentProcessingError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
