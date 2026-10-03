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

