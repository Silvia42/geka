# GEKA — Grounded Enterprise Knowledge Assistant

## Implementation Plan

## 1. Project Overview

**GEKA (Grounded Enterprise Knowledge Assistant)** is a document question-answering application designed to answer questions using information from uploaded documents.

The main problem addressed by the project is that general-purpose LLMs can generate answers that are not supported by an organization's documentation. GEKA will use Retrieval-Augmented Generation (RAG) to retrieve relevant document content before generating an answer.

The goal is not to guarantee that hallucinations never occur. Instead, the application will focus on producing answers grounded in retrieved evidence and indicating when the available documents do not contain enough information to answer a question.

---

## 2. MVP Scope

The minimum viable product will support the following workflow:

```text
User uploads PDF documents
        ↓
PDF text extraction
        ↓
Text chunking
        ↓
Embedding generation
        ↓
ChromaDB vector storage
        ↓
User asks a question
        ↓
Relevant document chunks are retrieved
        ↓
Retrieved context is sent to the LLM
        ↓
Grounded answer is generated
        ↓
Answer and source references are displayed
```

### MVP Features

* Upload one or more PDF documents.
* Extract text and preserve document and page metadata.
* Split document text into chunks.
* Generate embeddings using SentenceTransformers.
* Store embeddings and metadata in ChromaDB.
* Accept user questions through a web interface.
* Retrieve relevant document chunks.
* Use an open-source LLM running through Ollama.
* Generate answers based on retrieved context.
* Display supporting document and page references.
* Return an insufficient-information response when relevant evidence cannot be found.

---

## 3. Technology Stack

### Frontend

* React
* TypeScript

The frontend will provide a simple interface for document upload and document question answering.

### Backend

* Python
* FastAPI

The backend will manage document processing, retrieval, LLM interaction, and communication with the frontend.

### RAG Components

* **PDF extraction:** pypdf or pdfplumber
* **Embeddings:** SentenceTransformers
* **Vector database:** ChromaDB
* **LLM execution:** Ollama
* **LLM:** A lightweight open-source model selected after local testing

The final model will be selected based on response quality, grounding behavior, and performance on the available development hardware.

---

## 4. Architecture

GEKA will initially use a simple two-service architecture:

```text
React Frontend
       │
       │ HTTP / REST
       ▼
FastAPI Backend
       │
       ├── Document Processing
       ├── Embedding Service
       ├── Retrieval Service
       └── LLM Service
              │
       ┌──────┴───────┐
       ▼              ▼
   ChromaDB        Ollama
```

Authentication and enterprise SSO are not part of the MVP.

A future version could add SSO using a Backend-for-Frontend (BFF) architecture.

---

## 5. Development Plan

### Phase 1 — Research and Setup

* Create the GitHub repository.
* Set up the Python and Node.js development environments.
* Research and test local open-source LLM options.
* Install and test Ollama.
* Select an initial embedding model.
* Create the initial architecture and workflow diagrams.

**Goal:** Confirm that the selected tools can run locally before building the full application.

---

### Phase 2 — RAG Proof of Concept

Build the RAG workflow as a local Python application before creating the web application.

```text
PDF → Text → Chunks → Embeddings → ChromaDB → Retrieval → LLM → Answer
```

**Goal:** Successfully ask questions about a document and receive answers based on retrieved content.

---

### Phase 3 — Grounding and Citations

Improve the RAG workflow by adding:

* Document metadata.
* Page number tracking.
* Source references.
* Prompt instructions focused on retrieved evidence.
* Insufficient-information handling.

**Goal:** Demonstrate that answers are supported by retrieved document content.

---

### Phase 4 — FastAPI Backend

Create API endpoints for:

* Document upload and processing.
* Listing uploaded documents.
* Submitting questions.
* Returning answers and source references.

**Goal:** Make the RAG functionality available through a clean backend API.

---

### Phase 5 — React Frontend

Build a simple user interface with:

* PDF upload.
* Uploaded document list.
* Question input.
* Answer display.
* Source references.

**Goal:** Provide a complete end-to-end user experience.

---

### Phase 6 — Testing

Test the application using:

1. Questions with answers clearly present in the documents.
2. Questions not covered by the knowledge base.
3. Similar information across multiple documents.
4. Conflicting information when applicable.
5. Prompt injection attempts.
6. Citation accuracy.

The results will be documented and used to identify limitations and possible improvements.

---

### Phase 7 — Documentation and Presentation

Prepare:

* Project README.
* Technical workflow diagram.
* Architecture description.
* Technology and model selection explanation.
* Testing results.
* Challenges and lessons learned.
* Screenshots of the application.
* A 5–10 minute final presentation and demonstration.

---

## 6. Project Repository

The project will use a single GitHub repository.

```text
geka/
├── frontend/
├── backend/
├── docs/
├── README.md
├── implementation_plan.md
└── .gitignore
```

The frontend and backend will remain separate applications while being managed in one repository.

---

## 7. MVP Definition

The GEKA MVP is complete when a user can:

1. Upload PDF documents.
2. Ask a question about those documents.
3. Have relevant document content retrieved through semantic search.
4. Receive an answer generated by an open-source LLM.
5. See the document and page supporting the answer.
6. Receive an appropriate response when the available documents do not provide sufficient evidence.

The application will run locally without requiring paid APIs or model training.

---

## 8. Optional Enhancements

The following features will only be considered after the MVP is complete:

* Additional document formats such as TXT, DOCX, or Markdown.
* Document deletion and re-indexing.
* Structured RAG evaluation metrics.
* Improved UI/UX.
* Docker and Docker Compose.
* Cloud deployment.
* Enterprise SSO using a BFF architecture.
* Role-based access control.

---

## 9. Out of Scope for the MVP

The MVP will not include:

* Model training or fine-tuning.
* Paid LLM APIs.
* Authentication or authorization.
* Multi-user access control.
* Website crawling.
* Enterprise shared-drive integrations.
* Production-scale infrastructure.

Keeping these features outside the initial scope will allow the project to focus on building a complete and reliable RAG workflow within the available capstone timeframe.

---

## 10. Success Criteria

The project will be successful if GEKA:

* Runs end-to-end without errors.
* Uses an open-source LLM.
* Accepts user input and produces LLM-generated output.
* Implements a complete RAG workflow.
* Retrieves relevant document content.
* Generates answers using retrieved evidence.
* Provides source references.
* Handles unsupported questions appropriately.
* Includes clear documentation and a workflow diagram.
* Can be demonstrated in a live presentation.
