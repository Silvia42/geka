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

- Answer questions using retrieved knowledge-base content.
- Provide source references supporting answers.
- Identify the source document and page number when available.
- Indicate when sufficient information cannot be found.
- Reduce unsupported responses by grounding answers in retrieved evidence.

---

## 🎯 Project Goals

The main goals of GEKA are to:

- Build a complete end-to-end AI application.
- Use an open-source Large Language Model.
- Allow users to upload PDF documents.
- Extract and process document content.
- Generate embeddings for semantic search.
- Store and retrieve document chunks using a vector database.
- Generate answers based on retrieved context.
- Display supporting source references.
- Handle questions that cannot be answered using the available knowledge base.
- Run locally without requiring paid APIs or model training.

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

## 🚀 How to Run the Local Web Server

Follow these steps to spin up the local development server and view a live React app in your browser.

### Prerequisites
Make sure you have completed the base environment setup:
* Node.js (`v24.21.0` or higher) and `pnpm` must be installed globally.
* Your terminal must be navigated into the `frontend` folder layer.

---

### Step 1: Install Project Dependencies
If you haven't already, install the necessary package packages (like React, TypeScript, and Vite/Next.js) declared by the Figma export:
```bash
cd frontend
pnpm install
```

### Step 2: Identify Your Launch Command
Open the `frontend/package.json` file and look under the `"scripts"` block. 
* If you see `"dev": "vite"` or `"dev": "next dev"`, your launch script is **`dev`**.
* If you see `"start": "react-scripts start"`, your launch script is **`start`**.

### Step 3: Start the Development Server

From the `frontend` directory, run:

```bash
pnpm dev
```

Vite will start the development server and display the local URL in the terminal.

### Step 4: Open in Your Browser

The GEKA frontend currently runs on port `8443`.

Look for:

```text
➜  Local:   http://localhost:8443/
```

Open **http://localhost:8443/** in your browser.

You can also hold **Cmd** (Mac) and click the URL directly in the VS Code terminal.

The Vite development server supports hot reload, so changes to the frontend source code are automatically reflected in the browser.

---


## 🛠️ Troubleshooting Local Launch Issues

### 1. Missing Scripts Error
* **The Symptom:** Terminal returns `ERR_PNPM_MISSING_SCRIPT`.
* **The Fix:** Open `frontend/package.json`, check the exact text inside the `"scripts"` object, and make sure your command matches one of those keys perfectly.

### 2. Port Already in Use
* **The Symptom:** The server launches on a strange port (like `8444` instead of `8443`).
* **The Why:** Another development process is running invisibly in the background. You can safely use the new port numbers provided, or close your terminal entirely and restart VS Code to clear the stale process.
