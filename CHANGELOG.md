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
* Made source tiles open document previews at the cited PDF page, with retrieved passages displayed alongside the document.
* Added light/dark preview dialogs with loading and error states, keyboard dismissal, and a link to open the PDF in a separate tab.
* Added a read-only PDF preview endpoint with path validation; previewing does not modify files on disk.
* Added backend tests for PDF preview serving, unsafe-path rejection, missing files, and retrieved source excerpts.
* Added regression tests for insufficient evidence after retrieval, relevance filtering, consecutive chat responses, independent indexed-document listing, and structured Ollama response validation.
* Added tests for supporting-page selection, citation renumbering, duplicate page excerpts, answers without inline citations, and invalid source references.

### Fixed

* Prevented retrieved documents from appearing as supporting sources when Ollama reports insufficient evidence, using an explicit internal evidence-status field while preserving the public API and retrieval threshold.
* Hid the answer-specific Sources section when no sources are returned, preserving indexed-document management and PDF source previews.
* Restricted answer sources to document pages selected as direct supporting evidence using validated model-selected source IDs; excluded unused retrieved pages, rejected invalid source references, and kept citation numbers aligned with the displayed sources.

### Known Limitations

* Scanned PDFs are not supported because OCR is not implemented.
* Generated answers can still include claims that are not fully supported by retrieved text; citations should be checked against their source pages.
* Embedded PDF rendering and cited-page navigation depend on browser PDF-viewer support. Previews show retrieved passages rather than highlighting exact answer sentences within the PDF.

