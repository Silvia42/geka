import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import rag_service


class RagServiceTests(unittest.TestCase):
    def test_answer_abstains_when_no_relevant_chunks_are_found(self):
        empty_results = {"documents": [[]], "metadatas": [[]], "distances": [[]]}
        with (
            patch("app.chroma_store.search_chunks", return_value=empty_results),
            patch("app.rag_service._call_ollama") as generate,
        ):
            result = rag_service.answer_question("What is the policy?")

        self.assertEqual(result["sources"], [])
        self.assertIn("couldn't find enough information", result["answer"])
        generate.assert_not_called()

    def test_answer_builds_source_context_before_generation(self):
        results = {
            "documents": [["First passage", "Second passage"]],
            "metadatas": [
                [
                    {"document": "guide.pdf", "page": 2},
                    {"document": "guide.pdf", "page": 3},
                ]
            ],
            "distances": [[0.2, 0.3]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service._call_ollama", return_value="Answer [Source 1]"
            ) as generate,
        ):
            result = rag_service.answer_question(
                "What is covered?", [{"role": "user", "content": "Earlier question"}]
            )

        self.assertEqual(result["answer"], "Answer [Source 1]")
        self.assertEqual(
            result["sources"],
            [
                {"filename": "guide.pdf", "page": 2},
                {"filename": "guide.pdf", "page": 3},
            ],
        )
        messages = generate.call_args.args[0]
        self.assertIn(
            "[Source 1]\nDocument: guide.pdf\nPage: 2", messages[-1]["content"]
        )
        self.assertIn(
            "[Source 2]\nDocument: guide.pdf\nPage: 3", messages[-1]["content"]
        )
        self.assertEqual(messages[-2], {"role": "user", "content": "Earlier question"})
        self.assertNotIn("Unrelated passage", messages[-1]["content"])

    def test_ingest_persists_and_indexes_a_pdf(self):
        pages = [{"document": "folder/guide.pdf", "page": 1, "text": "Useful text"}]
        chunks = [
            {
                "document": "folder/guide.pdf",
                "page": 1,
                "chunk_id": "folder/guide.pdf_1_0",
                "text": "Useful text",
            }
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            with (
                patch.object(rag_service, "DOCUMENTS_DIR", Path(temp_dir)),
                patch("app.rag_service.extract_pages", return_value=pages),
                patch("app.rag_service.chunk_pages", return_value=chunks),
                patch("app.chroma_store.replace_document") as replace_document,
            ):
                result = rag_service.ingest_pdf(
                    "guide.pdf", b"pdf bytes", "folder/guide.pdf"
                )

            self.assertTrue((Path(temp_dir) / "folder" / "guide.pdf").exists())
            self.assertEqual(result["pages_processed"], 1)
            self.assertEqual(result["chunks_created"], 1)
            replace_document.assert_called_once_with(chunks, "folder/guide.pdf")

    def test_ingest_rejects_path_traversal(self):
        with self.assertRaises(rag_service.DocumentProcessingError):
            rag_service.ingest_pdf("guide.pdf", b"pdf bytes", "../guide.pdf")


if __name__ == "__main__":
    unittest.main()
