from pathlib import Path

from app.pdf_processor import extract_pages
from app.chunker import chunk_pages


DOCUMENTS_DIR = Path(__file__).parent / "data" / "documents"


def main():
    pdf_files = list(DOCUMENTS_DIR.glob("*.pdf"))

    if not pdf_files:
        print(f"No PDF files found in {DOCUMENTS_DIR}")
        return

    pdf_path = pdf_files[0]

    print(f"Document: {pdf_path.name}")
    print("-" * 50)

    # Step 1: Extract PDF pages
    pages = extract_pages(pdf_path)

    print(f"Pages extracted: {len(pages)}")

    if not pages:
        print("No text was extracted from the PDF.")
        return

    # Step 2: Split pages into chunks
    chunks = chunk_pages(pages)

    print(f"Chunks created: {len(chunks)}")
    print("-" * 50)

    # Step 3: Display a few chunks
    for chunk in chunks[:3]:
        print("\n--- Chunk ---")
        print(f"Document: {chunk['document']}")
        print(f"Page:     {chunk['page']}")
        print(f"Chunk ID:  {chunk['chunk_id']}")
        print(f"Text:     {chunk['text'][:500]}")


if __name__ == "__main__":
    main()
    