## [v1.0.0] — Initial Project Setup

### Added

* Created the GEKA monorepo containing:

  * `backend/` — Python/FastAPI backend
  * `frontend/` — React frontend
  * `docs/` — project documentation
* Created initial project documentation and implementation plan.
* Set up Python 3.12 development environment using `uv`.
* Added backend dependency management with `pyproject.toml` and `uv.lock`.
* Implemented initial PDF text extraction.
* Implemented document text chunking with document and page metadata.
* Added SentenceTransformers embeddings using `all-MiniLM-L6-v2`.
* Added ChromaDB vector storage.
* Tested local embedding generation and vector storage.
* Installed and tested Ollama locally.
* Added the initial React/TypeScript frontend generated from the GEKA Figma design.
* Configured Vite development server.
* Configured Tailwind CSS v4.
* Configured frontend formatting with Oxfmt.
* Configured Python formatting with Black.
* Added local development documentation.
* Connected PDF uploads to document storage, text extraction, chunking, embedding generation, and ChromaDB indexing.
* Added indexed-document listing and document replacement during re-upload.
* Connected chat to semantic retrieval and local Ollama answer generation with document and page sources.
* Added relevance filtering and an insufficient-information response when retrieved evidence is too weak.
* Connected the frontend PDF upload controls and indexed-document list to the backend.
* Added individual document deletion and clear-all controls with confirmation dialogs; deletion removes ChromaDB records while preserving uploaded PDF files on disk.
* Styled deletion confirmations to match the GEKA interface in light and dark themes.
* Added backend tests for ingestion, retrieval context, source references, abstention, and PDF preservation during deletion.
* Documented Ollama setup and model configuration.

### Known Limitations

* Scanned PDFs are not supported because OCR is not implemented.
* Generated answers can still include claims that are not fully supported by retrieved text; citations should be checked against their source pages.

