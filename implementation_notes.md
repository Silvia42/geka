# GEKA Implementation Notes

## 1. PDF Processing

### Purpose

The first stage of GEKA is to extract text from uploaded PDF documents while preserving the page number.

This page-level metadata is important because the final RAG answer should be able to cite the source document and page where the information was found.

### File

`backend/app/pdf_processor.py`

### Implementation

The PDF processor uses **pypdf** and returns one dictionary per page containing:

* `document` — PDF filename
* `page` — page number
* `text` — extracted page text

The processor ignores pages where no usable text was extracted.

### Processing flow

```text
PDF file
   ↓
PdfReader
   ↓
Read each page
   ↓
Extract text
   ↓
Remove empty pages
   ↓
Return page text + document/page metadata
```

### Why preserve page metadata?

RAG retrieval should not return only text. GEKA needs to know where the text came from so that a later answer can provide citations such as:

```text
Source: experian-credit-guide.pdf, page 12
```

This also allows the retrieved chunks to remain traceable back to the original document.

---

## 2. Text Chunking

After extracting the PDF pages, the text is divided into smaller chunks before creating embeddings.

### File

`backend/app/chunker.py`

### Current approach

The chunker uses:

* `chunk_size = 800`
* `overlap = 100`

The overlap means that consecutive chunks share some text.

Example:

```text
Chunk 1:
[----------------------------------------]
             800 characters

Chunk 2:
                         [----------------------------------------]
                         100 overlapping characters
```

### Why chunk the text?

Embedding an entire document or page as one vector would make semantic retrieval less precise.

Smaller chunks allow ChromaDB to retrieve the specific parts of a document that are relevant to a user's question.

Each chunk keeps:

* `document`
* `page`
* `chunk_id`
* `text`

The `chunk_id` should be globally unique across documents. A suitable format is:

```text
document_page_startposition
```

For example:

```text
experian-credit-guide.pdf_12_700
```

This prevents two different PDF documents from accidentally creating the same ChromaDB ID.

---

# 3. Embedding Model

GEKA uses:

```text
all-MiniLM-L6-v2
```

from **SentenceTransformers**.

### File

`backend/app/embeddings.py`

The model converts text into numerical vectors.

For example:

```text
"What factors affect a person's credit score?"
```

becomes a vector with:

```text
384 dimensions
```

These vectors allow GEKA to compare the semantic meaning of the user's question with the meaning of document chunks.

### RAG purpose

The embedding stage is what makes semantic retrieval possible:

```text
Document chunk
      ↓
Embedding
      ↓
384-dimensional vector
      ↓
ChromaDB

User question
      ↓
Embedding
      ↓
384-dimensional vector
      ↓
Compare with stored vectors
      ↓
Retrieve relevant chunks
```

`all-MiniLM-L6-v2` is small enough to run locally and is appropriate for the local GEKA capstone environment.

---

# 4. Important Dependency Compatibility Problem

## Initial setup

The original environment contained:

```text
torch                  2.2.2
sentence-transformers  6.1.0
transformers           5.17.0
```

This caused SentenceTransformers to fail when loading the model.

The error indicated that Transformers disabled PyTorch because the installed PyTorch version was too old:

```text
[transformers] Disabling PyTorch because PyTorch >= 2.5 is required but found 2.2.2
```

## Why this happened

The problem was not the `all-MiniLM-L6-v2` model.

The problem was the combination of package versions.

The newer:

```text
Transformers 5.17.0
```

expects a newer PyTorch version.

However, GEKA is being developed on a **2019 Intel MacBook Pro**, and upgrading PyTorch was not the appropriate solution because normal macOS Intel/x86_64 PyTorch binary support ended around the 2.2 series.

Therefore, instead of upgrading PyTorch, the compatible approach was to use older versions of SentenceTransformers and Transformers.

---

# 5. Final Compatible Python Setup

The relevant versions are now:

```text
Python               3.12.x
PyTorch              2.2.2
SentenceTransformers 3.0.1
Transformers         4.46.3
```

The important dependency relationship is:

```text
Python 3.12
     ↓
PyTorch 2.2.2
     ↓
Transformers 4.46.3
     ↓
SentenceTransformers 3.0.1
     ↓
all-MiniLM-L6-v2
```

The versions were pinned in `pyproject.toml`:

```toml
dependencies = [
    "torch==2.2.2",
    "fastapi==0.141.1",
    "uvicorn",
    "pypdf==6.19.0",
    "sentence-transformers==3.0.1",
    "transformers==4.46.3",
    "chromadb==1.5.9",
    "onnxruntime==1.23.2"
]
```

`uv` is used to manage the Python environment and lock dependencies.

After changing `pyproject.toml`, the environment was synchronized with:

```bash
uv sync
```

The existing `.venv` was kept; it did not need to be recreated.

---

# 6. Verification

First, the installed versions were checked with:

```bash
uv pip show torch
uv pip show sentence-transformers
uv pip show transformers
```

Expected versions:

```text
torch                  2.2.2
sentence-transformers  3.0.1
transformers           4.46.3
```

PyTorch was then tested:

```bash
uv run python -c "import torch; print(torch.__version__); print(torch.backends.mps.is_available())"
```

Result:

```text
2.2.2
True
```

The embedding model was then loaded directly:

```bash
uv run python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('all-MiniLM-L6-v2'); print('Model loaded successfully')"
```

Result:

```text
Model loaded successfully
```

This confirmed that the model can successfully load in the GEKA environment.

---

# 7. Lesson Learned

The important lesson from this setup problem is:

> A Python package may be individually valid but still be incompatible with another package in the project.

In this case:

```text
SentenceTransformers 6.1.0
        +
Transformers 5.17.0
        +
PyTorch 2.2.2
```

did not work together.

The solution was **not** to blindly upgrade everything.

Instead, the hardware constraint was considered first:

```text
Intel Mac
    ↓
Keep PyTorch 2.2.2
    ↓
Choose compatible versions of the higher-level libraries
```

This is an important practical lesson for ML/AI projects: dependency versions are part of the system architecture, especially when running ML frameworks locally.

---

# 8. Current GEKA Pipeline

At this point, the ingestion/retrieval architecture is:

```text
PDF
 ↓
pypdf
 ↓
Page text + page metadata
 ↓
Chunking
 ↓
Text chunks + metadata
 ↓
SentenceTransformers
 ↓
384-dimensional embeddings
 ↓
ChromaDB
 ↓
Semantic retrieval
```

The next stage is to verify that ChromaDB can store the generated embeddings and retrieve the most relevant chunks for a user question.

Only after retrieval works reliably should the Ollama LLM be connected.

---

# 9. Development Principle

GEKA is intentionally being implemented without LangChain or another RAG framework.

The goal is to understand the individual RAG components:

```text
PDF extraction
      ↓
Chunking
      ↓
Embeddings
      ↓
Vector database
      ↓
Similarity search
      ↓
LLM
      ↓
Grounded answer + citations
```

Using the individual components directly makes it easier to understand what each part of the RAG system is actually doing.
