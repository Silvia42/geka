def chunk_pages(
    pages: list[dict],
    chunk_size: int = 800,
    overlap: int = 100,
) -> list[dict]:
    chunks = []

    for page in pages:
        text = page["text"]
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]
            chunks.append(
                {
                    "document": page["document"],
                    "page": page["page"],
                    # "chunk_id": f"{page['page']}_{start}",
                    "chunk_id": f"{page['document']}_{page['page']}_{start}",
                    "text": chunk_text,
                }
            )
            start += chunk_size - overlap

    return chunks
