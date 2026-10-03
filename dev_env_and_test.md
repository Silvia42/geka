# GEKA Development Environment & Test Commands

This document contains the commands used to activate the GEKA backend environment, run tests, verify dependencies, and perform basic development checks.

---

## 1. Project Structure

The Python backend is located in:

```text
GEKA/
└── backend/
    ├── .venv/
    ├── app/
    ├── data/
    │   └── documents/
    ├── chroma_db/
    ├── test_ingestion.py
    ├── test_vector_store.py
    ├── pyproject.toml
    └── uv.lock
```

All backend commands should normally be run from the `backend` directory.

---

## 2. Navigate to the Backend

From the GEKA project root:

```bash
cd backend
```

Verify the current directory:

```bash
pwd
```

---

## 3. Activate the Virtual Environment

Activate the existing Python virtual environment:

```bash
source .venv/bin/activate
```

After activation, the terminal prompt should show:

```text
(backend)
```

The `.venv` was created with `uv` and should not be deleted or recreated unless there is a specific reason to rebuild the environment.

---

## 4. Deactivate the Virtual Environment

When finished working:

```bash
deactivate
```

The `(backend)` prefix should disappear from the terminal prompt.

---

## 5. Check Python Version

GEKA currently uses Python 3.12. Check the Python version used by the project:

```bash
uv run python --version
```

**Expected Output:**
```text
Python 3.12.x
```

---

## 6. Synchronize the Environment

If `pyproject.toml` has been changed, synchronize the virtual environment and lock file:

```bash
uv sync
```

`uv` uses:
* `pyproject.toml` — project dependencies and configuration
* `uv.lock` — locked dependency versions
* `.venv/` — local virtual environment

> [!WARNING]
> Do not use `pip install` to manually manage project dependencies.

When adding or changing dependencies, update `pyproject.toml` and then run:
```bash
uv sync
```

---

## 7. Check Installed Packages

Check a specific package version:

```bash
uv pip show torch
uv pip show sentence-transformers
uv pip show transformers
uv pip show chromadb
```

Current expected versions for core ML packages:
```text
torch                  2.2.2
sentence-transformers  3.0.1
transformers           4.46.3
```

---

## 8. Test PyTorch

Verify that PyTorch can be imported properly:

```bash
uv run python -c "import torch; print(torch.__version__)"
```

Check whether PyTorch reports MPS availability:

```bash
uv run python -c "import torch; print(torch.backends.mps.is_available())"
```

**Current environment status:**
* **PyTorch:** 2.2.2
* **MPS available:** True

*Note: GEKA is being developed on a 2019 Intel MacBook Pro. The PyTorch version is intentionally pinned to 2.2.2 for compatibility with the Intel macOS environment.*

---

## 9. Test the SentenceTransformers Model

GEKA uses the `all-MiniLM-L6-v2` embedding architecture. Verify that the model loads without version runtime errors:

```bash
uv run python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('all-MiniLM-L6-v2'); print('Model loaded successfully')"
```

**Expected Result:**
```text
Model loaded successfully
```

---

## 10. Test Embedding Generation

Test that the model actually generates correct numerical vectors:

```bash
uv run python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('all-MiniLM-L6-v2'); embeddings = model.encode(['What factors affect a person credit score?']); print('Shape:', embeddings.shape); print('First 5 values:', embeddings[0][:5])"
```

**Expected Shape:**
```text
Shape: (1, 384)
```

This output confirms:
* `1` = one processed input sentence
* `384` = the standard embedding vector dimensions produced by `all-MiniLM-L6-v2`

---

## 11. Run PDF Ingestion Test

The ingestion test verifies PDF layout parsing, text extraction, and token chunking blocks.

```bash
uv run python test_ingestion.py
```

The validation script confirms:
* The source PDF document can be found
* PDF pages can be parsed
* Page numbers are preserved in metadata
* Text strings are extracted
* Fixed-size text chunks are created cleanly
* Chunk metadata matches specifications

This evaluation parses the following sample document:
`data/documents/experian-credit-guide.pdf`

---

## 12. Run Vector Store Test

The vector store test evaluates the next foundational pipeline stage of the RAG platform.

```bash
uv run python test_vector_store.py
```

The routine steps through:
```text
PDF
 ↓
PDF extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
ChromaDB Storage
 ↓
Semantic Similarity Search
 ↓
Retrieved Relevant Chunks
```

---

## 13. Run Tests Without Activating .venv

Because `uv run` automatically locks execution contexts to the project's locked space, scripts can be executed directly from bare terminals inside the backend root folder without typing `source .venv/bin/activate`.

```bash
uv run python test_ingestion.py
uv run python test_vector_store.py
```

*Note: Activating `.venv` is convenient for editor tooling integration during local development, but is not technically required for testing loops using `uv run`.*

---

## 14. Typical Development Session

A standard day-to-day backend development loop:

```bash
cd backend
source .venv/bin/activate

# Execute validations
uv run python test_ingestion.py
uv run python test_vector_store.py

# Terminate session
deactivate
```

---

## 15. Dependency Changes

When introducing or pinning a new python library:

1. Edit the `dependencies` block inside `pyproject.toml`.
2. Run environment synchronization:
   ```bash
   uv sync
   ```
3. Verify file links:
   ```bash
   uv pip show <PACKAGE_NAME>
   ```
4. Run regression verification suites to check stability.

---

## 16. Important Dependency Compatibility Note

The initial project setup attempted to use the following environment configuration:
```text
torch                  2.2.2
sentence-transformers  6.1.0
transformers           5.17.0
```

This combination was fundamentally broken. The newer `transformers` core engine explicitly disabled PyTorch functionality because it detected an older runtime framework version:

```text
[transformers] Disabling PyTorch because PyTorch >= 2.5 is required but found 2.2.2
```

The system architecture constraints require keeping **PyTorch 2.2.2** to maintain compatibility with legacy Intel macOS binary drivers. The solution was to down-grade the higher-level libraries until semantic interfaces aligned.

The validated working configuration is:
```text
Python               3.12.x
PyTorch              2.2.2
SentenceTransformers 3.0.1
Transformers         4.46.3
```

Pinned items inside `pyproject.toml`:
```toml
"torch==2.2.2",
"sentence-transformers==3.0.1",
"transformers==4.46.3",
```

---


## 17. Code Formatting Infrastructure: Oxc vs. Prettier

The project workspace originally contained active configurations for both the Prettier and Oxc extensions. This created an editor-level conflict where VS Code silently refused to format code files on save because multiple formatters were fighting for control of `[typescriptreact]` (.tsx) files.

### Why Oxc Was Chosen Over Prettier
While Prettier is the industry standard JavaScript/TypeScript formatter, it is written in JavaScript and can become sluggish on larger files. **Oxc (and its underlying tool `oxfmt`) was chosen because it is written in Rust**. It is engineered to be a drop-in, lightning-fast replacement for Prettier, formatting files up to **100x faster** while respecting standard formatting layouts.

### ❌ What Went Wrong and Why (Intel macOS Specifics)
1. **The System Binary Trap:** The Oxc VS Code extension does not bundle its own formatter binaries. It requires a functioning global or local Node.js engine to run `oxfmt`. Because Homebrew has dropped pre-compiled binary support for Intel Mac architectures (`x86_64`), running `brew install node` forced the machine to compile packages from source, which crashed on legacy directory write blocks.
2. **Nested Directory Blindness:** The initial environment ran `pnpm install` at the workspace root directory. However, the true project `package.json` configuration and target source code live inside a nested `frontend/` folder. The formatter could not find its executable binaries because they were installed in the wrong folder layer.
3. **Missing Activation Flags:** Oxc requires explicit enablement inside user properties before it triggers its execution engine. Without these flags, it defaults strictly to linting code errors and ignores formatting.

---

###  The Validated Working Setup Sequence

To successfully bypass the Intel compilation limits and route the formatter binaries correctly, the environment was configured using direct vendor packages and localized path routing.

#### 1. Runtime Foundation Setup
Bypassed Homebrew completely and installed the pre-compiled Intel runtime package directly:
* **Source:** Official Node.js LTS Installer (`.pkg`) downloaded from [nodejs.org](https://nodejs.org).
* **Verified Runtime Output:**
  ```bash
  node -v # Outputs: v24.21.0
  npm -v  # Outputs: 11.19.0
  ```

#### 2. Local Package Hydration
Navigated into the actual project directory to build out the correct execution paths:
```bash
cd frontend
npm install -g pnpm
pnpm install
```

#### 3. Pinned Dependency Adjustments (`package.json`)
The local project package relies on a specific, stable release of the formatter:
```json
"devDependencies": {
  "oxfmt": "^0.71.0"
}
```

#### 4. Absolute Workspace Environment Blueprint (`.vscode/settings.json`)
To force VS Code to route files into Oxc and completely block Prettier interference, the following configuration was pinned to the **`GEKA/`** folder root:

```json
{
    "oxc.enable.oxfmt": true,
    "oxc.path.oxfmt": "./frontend/node_modules/.bin/oxfmt",
    "editor.formatOnSave": true,
    "editor.formatOnSaveMode": "file",

    "[typescript]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    }
}
```
*Note: Run `Cmd + Shift + P` -> `Oxc: Restart oxfmt Server` inside VS Code to apply any updates to this configuration layer.*

---

## 18. Important Development Rules

### Rule A: Always use uv for Python environment management
Utilize explicit sandbox commands:
```bash
uv sync
uv run ...
uv pip show ...
```
Do **not** use manual, global bindings like `pip install ...`.

### Rule B: Keep dependency versions intentional
Machine learning frameworks contain strict binary contracts. Before altering any underlying system module version, verify explicit alignment with:
* Python core version
* Operating system variant
* Local CPU architectures (Intel x86_64 constraints)
* PyTorch tensor backends

### Rule C: Do not recreate .venv unnecessarily
The current environment state is functional. Do not wipe out the local `.venv` catalog to add or update single packages. Running `uv sync` handles file reconciliation safely.

---

## 19. Quick Command Reference

| Action | Command |
| :--- | :--- |
| **Start workspace** | `cd backend && source .venv/bin/activate` |
| **Check runtime environment** | `uv run python --version` |
| **Sync configurations** | `uv sync` |
| **Inspect framework versions** | `uv pip show torch sentence-transformers transformers` |
| **Validate torch compilation** | `uv run python -c "import torch; print(torch.__version__)"` |
| **Test core embedding engine** | `uv run python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('all-MiniLM-L6-v2'); print('Model loaded successfully')"` |
| **Verify processing pipeline** | `uv run python test_ingestion.py` |
| **Verify persistence layer** | `uv run python test_vector_store.py` |
| **Exit environment** | `deactivate` |

---

## 20. Current GEKA Development Flow

```text
Activate environment
↓
Check dependencies
↓
Test PDF extraction
↓
Test chunking
↓
Test embeddings
↓
Test ChromaDB
↓
Test semantic retrieval
↓
Add Ollama
↓
Build FastAPI endpoint
↓
Connect React frontend
```
The active roadmap block focuses on perfecting the localized RAG retrieval context link:

PDF → Chunks → Embeddings → ChromaDB → Semantic Retrieval.

