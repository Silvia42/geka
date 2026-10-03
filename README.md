# GEKA — Grounded Enterprise Knowledge Assistant

A Retrieval-Augmented Generation (RAG) application designed to answer questions using information from uploaded documents.

GEKA focuses on **grounded responses** by retrieving relevant document content before generating an answer and providing source references to support the response.

> **Capstone Project — AI Application Development**

---

## 📌 Project Overview

Organizations often store important information across documents such as policies, procedures, technical documentation, and employee guides. Finding accurate information can require manually searching through multiple documents.

General-purpose Large Language Models (LLMs) can provide quick answers, but they may generate information that is not supported by an organization's documentation.

GEKA addresses this problem by using **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded documents before sending context to a Large Language Model.

The goal is not to guarantee that hallucinations never occur. Instead, GEKA is designed to:

* Answer questions using retrieved knowledge-base content.
* Provide source references supporting answers.
* Identify the source document and page number when available.
* Indicate when sufficient information cannot be found.
* Reduce unsupported responses by grounding answers in retrieved evidence.

---

## 🎯 Project Goals

The main goals of GEKA are to:

* Build a complete end-to-end AI application.
* Use an open-source Large Language Model.
* Allow users to upload PDF documents.
* Extract and process document content.
* Generate embeddings for semantic search.
* Store and retrieve document chunks using a vector database.
* Generate answers based on retrieved context.
* Display supporting source references.
* Handle questions that cannot be answered using the available knowledge base.
* Run locally without requiring paid APIs or model training.

---

## 🏗️ High-Level Architecture

```text
                    ┌─────────────────────┐
                    │                     │
                    │   React Frontend    │
                    │                     │
                    └──────────┬──────────┘
                               │
                            HTTP / REST
                               │
                    ┌──────────▼──────────┐
                    │                     │
                    │   FastAPI Backend   │
                    │                     │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   Document Processing   Retrieval Service      LLM Service
          │                    │                    │
          ▼                    ▼                    ▼
     PDF Extraction          ChromaDB            Ollama
          │                                         │
          ▼                                         ▼
      Text Chunking                       Open-Source LLM
          │                                         │
          └────────────────────┬────────────────────┘
                               │
                               ▼
                  Grounded Answer + Sources
```

---

## 🚀 How to Run the Local Web Server

### Prerequisites

Make sure you have:

* Node.js installed.
* `pnpm` installed.
* The GEKA repository cloned locally.

### Step 1: Install Frontend Dependencies

From the repository root:

```bash
cd frontend
pnpm install
```

### Step 2: Start the Development Server

From the `frontend` directory:

```bash
pnpm dev
```

Vite will start the development server and display the local URL in the terminal.

### Step 3: Open GEKA in Your Browser

The GEKA frontend currently runs on port `8443`.

Look for:

```text
➜  Local:   http://localhost:8443/
```

Open:

```text
http://localhost:8443/
```

The Vite development server supports hot reload, so changes to the frontend source code are automatically reflected in the browser.

---

## 🛠️ Troubleshooting Local Launch Issues

### 1. Missing Script Error

**Symptom:** The terminal returns an `ERR_PNPM_MISSING_SCRIPT` error.

**Fix:** Make sure you are in the `frontend` directory and run:

```bash
pnpm dev
```

The `dev` script is defined in `frontend/package.json`.

### 2. Port Already in Use

**Symptom:** Vite cannot use port `8443` or starts on a different port.

**Cause:** Another process may already be using port `8443`.

**Fix:** You can use the port displayed by Vite, or stop the process using port `8443` and restart the development server.
