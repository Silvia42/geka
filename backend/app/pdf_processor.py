from pathlib import Path

from pypdf import PdfReader


def extract_pages(pdf_path: Path, document_name: str | None = None) -> list[dict]:
    """Extract text from a PDF while preserving page metadata."""
    reader = PdfReader(pdf_path)

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            pages.append(
                {
                    "document": document_name or pdf_path.name,
                    "page": page_number,
                    "text": text.strip(),
                }
            )

    return pages