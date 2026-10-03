from pathlib import Path

from app.pdf_processor import extract_pages
from app.chunker import chunk_pages
from app.chroma_store import add_chunks, search_chunks


DOCUMENTS_DIR = Path(__file__).parent / "data/documents"


def main():
    pdf_path = DOCUMENTS_DIR / "experian-credit-guide.pdf"

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        return

    print(f"Document: {pdf_path.name}")
    print("=" * 60)

    # --------------------------------------------------------
    # STEP 1: Extract text from the PDF
    # --------------------------------------------------------

    pages = extract_pages(pdf_path)

    print(f"Pages extracted: {len(pages)}")

    if not pages:
        print("No text was extracted from the PDF.")
        return

    # --------------------------------------------------------
    # STEP 2: Split the document into chunks
    # --------------------------------------------------------

    chunks = chunk_pages(pages)

    print(f"Chunks created: {len(chunks)}")

    # --------------------------------------------------------
    # STEP 3: Create embeddings and store chunks in ChromaDB
    # --------------------------------------------------------

    print("\nAdding chunks to ChromaDB...")

    add_chunks(chunks)

    print("Chunks added successfully.")

    # --------------------------------------------------------
    # STEP 4: Test semantic search
    # --------------------------------------------------------

    questions = [
    "What factors affect a person's credit score?",
    "What information is included in a credit report?",
    "How long does negative information remain on a credit report?",
    "What should someone do if they find an error in their credit report?",
    ]

    for question in questions:
        print("\n" + "=" * 60)
        print("SEARCH")
        print("=" * 60)
        print(f"\nQuestion: {question}")

        results = search_chunks(question, n_results=3)

        print("\nRetrieved chunks:")

        for i, (document, metadata, distance) in enumerate(
            zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            ),
            start=1,
        ):
            print("\n--- Result", i, "---")
            print(f"Document: {metadata['document']}")
            print(f"Page:     {metadata['page']}")
            print(f"Chunk ID:  {metadata['chunk_id']}")
            print(f"Distance: {distance}")
            print(f"Text:     {document[:500]}")

    # --------------------------------------------------------
    # STEP 5: Display retrieved chunks
    # --------------------------------------------------------

    print("\nRetrieved chunks:")

    for i, (document, metadata, distance) in enumerate(
        zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ),
        start=1,
    ):
        print("\n--- Result", i, "---")
        print(f"Document: {metadata['document']}")
        print(f"Page:     {metadata['page']}")
        print(f"Chunk ID:  {metadata['chunk_id']}")
        print(f"Distance: {distance}")
        print(f"Text:     {document[:500]}")


if __name__ == "__main__":
    main()
    