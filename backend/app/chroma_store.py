from pathlib import Path

import chromadb

from app.embeddings import create_embeddings


# ============================================================
# CHROMADB VECTOR STORE
# ============================================================
#
# ChromaDB stores the information that GEKA needs for
# semantic search:
#
#   1. Chunk text
#   2. Embedding vector
#   3. Metadata about the source
#
# Our metadata includes:
#
#   document
#   page
#   chunk_id
#
# This allows GEKA to retrieve relevant text AND know where
# that text came from.
#
# Example:
#
#   Document: experian-credit-guide.pdf
#   Page: 4
#   Chunk ID: experian-credit-guide.pdf_4_700
#
# ChromaDB will later compare the embedding of a user's
# question with the embeddings stored here and return the
# most semantically similar chunks.
# ============================================================


CHROMA_DB_PATH = Path(__file__).parent.parent / "chroma_db"

chroma_client = chromadb.PersistentClient(
    path=str(CHROMA_DB_PATH)
)

collection = chroma_client.get_or_create_collection(
    name="geka_documents"
)


def add_chunks(chunks: list[dict]) -> None:
    """
    Add document chunks to ChromaDB.

    Each chunk is:
        1. Converted into an embedding.
        2. Stored in ChromaDB.
        3. Associated with its source metadata.
    """

    texts = [chunk["text"] for chunk in chunks]

    # Create an embedding for every chunk.
    embeddings = create_embeddings(texts)

    # ChromaDB requires IDs to be strings.
    ids = [str(chunk["chunk_id"]) for chunk in chunks]

    # Store information that tells us where the chunk came from.
    metadatas = [
        {
            "document": chunk["document"],
            "page": chunk["page"],
            "chunk_id": chunk["chunk_id"],
        }
        for chunk in chunks
    ]

    collection.add(
        ids=ids,
        embeddings=embeddings.tolist(),
        documents=texts,
        metadatas=metadatas,
    )


def search_chunks(query: str, n_results: int = 3):
    """
    Find the chunks that are most semantically similar
    to the user's question.
    """

    # Convert the user's question into an embedding.
    query_embedding = create_embeddings([query])[0]

    # Search ChromaDB for the closest vectors.
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results,
    )

    return results
