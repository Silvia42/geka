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