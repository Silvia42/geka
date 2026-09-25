from pathlib import Path

from app.pdf_processor import extract_pages
from app.chunker import chunk_pages


DOCUMENTS_DIR = Path(__file__).parent / "data/documents"


def main():
    pdf_path = DOCUMENTS_DIR / "experian-credit-guide.pdf"

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        return

    print(f"Document: {pdf_path.name}")
    print("=" * 60)

    # Extract PDF pages
    pages = extract_pages(pdf_path)

    print(f"Pages extracted: {len(pages)}")

    if not pages:
        print("No text was extracted from the PDF.")
        return

    # Create chunks
    chunks = chunk_pages(pages)

    print(f"Chunks created: {len(chunks)}")
    print("=" * 60)

    # Display first 3 chunks
    for chunk in chunks[:3]:
        print("\n--- Chunk ---")
        print(f"Document: {chunk['document']}")
        print(f"Page:     {chunk['page']}")
        print(f"Chunk ID:  {chunk['chunk_id']}")
        print(f"Text:     {chunk['text'][:500]}")


if __name__ == "__main__":
    main()
