import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from app import chroma_store, rag_service
from app.main import app


class RagServiceTests(unittest.TestCase):
    def test_preview_serves_nested_pdf_without_modifying_it(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            pdf = root / "folder" / "guide.pdf"
            pdf.parent.mkdir()
            pdf.write_bytes(b"%PDF-1.4\npreview fixture")
            with patch.object(rag_service, "DOCUMENTS_DIR", root):
                response = TestClient(app).get(
                    "/api/document/preview", params={"filename": "folder/guide.pdf"}
                )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.headers["content-type"], "application/pdf")
            self.assertIn("inline", response.headers["content-disposition"])
            self.assertEqual(response.content, pdf.read_bytes())

    def test_preview_rejects_unsafe_paths_and_missing_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch.object(rag_service, "DOCUMENTS_DIR", Path(temp_dir)):
                client = TestClient(app)
                for filename in ["../outside.pdf", "/outside.pdf", "guide.txt"]:
                    with self.subTest(filename=filename):
                        response = client.get(
                            "/api/document/preview", params={"filename": filename}
                        )
                        self.assertEqual(response.status_code, 400)
                response = client.get(
                    "/api/document/preview", params={"filename": "missing.pdf"}
                )
                self.assertEqual(response.status_code, 404)

    def test_chroma_remove_document_deletes_matching_chunk_ids(self):
        with (
            patch.object(
                chroma_store.collection,
                "get",
                return_value={"ids": ["one", "two"]},
            ) as get,
            patch.object(chroma_store.collection, "delete") as delete,
        ):
            removed = chroma_store.remove_document("folder/guide.pdf")

        self.assertTrue(removed)
        get.assert_called_once_with(
            where={"document": "folder/guide.pdf"}, include=["metadatas"]
        )
        delete.assert_called_once_with(ids=["one", "two"])

    def test_chroma_clear_documents_deletes_all_chunk_ids(self):
        records = {
            "ids": ["one", "two"],
            "metadatas": [
                {"document": "guide.pdf"},
                {"document": "folder/guide.pdf"},
            ],
        }
        with (
            patch.object(chroma_store.collection, "get", return_value=records),
            patch.object(chroma_store.collection, "delete") as delete,
        ):
            documents = chroma_store.clear_documents()

        self.assertEqual(documents, ["folder/guide.pdf", "guide.pdf"])
        delete.assert_called_once_with(ids=["one", "two"])

    def test_delete_document_api_preserves_pdf_on_disk(self):
        client = TestClient(app)
        with tempfile.TemporaryDirectory() as temp_dir:
            stored_file = Path(temp_dir) / "folder" / "guide.pdf"
            stored_file.parent.mkdir()
            stored_file.write_bytes(b"original pdf bytes")
            with (
                patch.object(rag_service, "DOCUMENTS_DIR", Path(temp_dir)),
                patch("app.chroma_store.remove_document", return_value=True) as remove,
            ):
                response = client.delete(
                    "/api/document", params={"filename": "folder/guide.pdf"}
                )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["filename"], "folder/guide.pdf")
            remove.assert_called_once_with("folder/guide.pdf")
            self.assertTrue(stored_file.exists())
            self.assertEqual(stored_file.read_bytes(), b"original pdf bytes")

    def test_clear_documents_api_preserves_all_pdfs_on_disk(self):
        client = TestClient(app)
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            first = root / "one.pdf"
            second = root / "folder" / "two.pdf"
            second.parent.mkdir()
            first.write_bytes(b"first pdf bytes")
            second.write_bytes(b"second pdf bytes")
            with (
                patch.object(rag_service, "DOCUMENTS_DIR", root),
                patch(
                    "app.chroma_store.clear_documents",
                    return_value=["one.pdf", "folder/two.pdf"],
                ) as clear,
            ):
                response = client.delete("/api/documents")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["documents_deleted"], 2)
            self.assertTrue(first.exists())
            self.assertEqual(first.read_bytes(), b"first pdf bytes")
            self.assertTrue(second.exists())
            self.assertEqual(second.read_bytes(), b"second pdf bytes")
            clear.assert_called_once_with()

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

    def test_answer_abstains_when_retrieved_evidence_is_insufficient(self):
        results = {
            "documents": [["The guide describes employee benefits."]],
            "metadatas": [[{"document": "guide.pdf", "page": 2}]],
            "distances": [[0.2]],
        }
        refusal = "I couldn't find enough information in the uploaded documents to answer that."
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service._call_ollama",
                return_value={
                    "answer": refusal,
                    "has_sufficient_evidence": False,
                    "supporting_source_ids": [],
                },
            ),
        ):
            result = rag_service.answer_question("What is the CEO's favorite color?")

        self.assertEqual(result["answer"], refusal)
        self.assertEqual(result["sources"], [])

    def test_answer_abstains_when_all_chunks_exceed_distance_limit(self):
        results = {
            "documents": [["Unrelated passage"]],
            "metadatas": [[{"document": "unrelated.pdf", "page": 1}]],
            "distances": [[rag_service.MAX_RETRIEVAL_DISTANCE + 0.1]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch("app.rag_service._call_ollama") as generate,
        ):
            result = rag_service.answer_question("What is the policy?")

        self.assertEqual(result["sources"], [])
        self.assertEqual(result["answer"], rag_service.INSUFFICIENT_INFORMATION_ANSWER)
        generate.assert_not_called()

    def test_chat_api_clears_sources_after_supported_answer_and_keeps_documents(self):
        results = {
            "documents": [
                ["Employees receive health insurance.", "Office hours are 9 to 5."]
            ],
            "metadatas": [
                [
                    {"document": "guide.pdf", "page": 2},
                    {"document": "unrelated.pdf", "page": 1},
                ]
            ],
            "distances": [[0.2, 0.3]],
        }
        documents = [
            {"filename": "guide.pdf", "pages": 3},
            {"filename": "unrelated.pdf", "pages": 1},
        ]
        model_responses = [
            {
                "answer": "Employees receive health insurance. [Source 1]",
                "has_sufficient_evidence": True,
                "supporting_source_ids": [1],
            },
            {
                "answer": "The excerpts do not establish the CEO's favorite color.",
                "has_sufficient_evidence": False,
                "supporting_source_ids": [],
            },
        ]
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch("app.chroma_store.list_documents", return_value=documents),
            patch("app.rag_service._call_ollama", side_effect=model_responses),
        ):
            client = TestClient(app)
            supported = client.post("/api/chat", json={"message": "What benefits?"})
            self.assertEqual(supported.status_code, 200)
            self.assertEqual(supported.json()["answer"], model_responses[0]["answer"])
            self.assertEqual(
                supported.json()["sources"],
                [
                    {
                        "filename": "guide.pdf",
                        "page": 2,
                        "excerpt": "Employees receive health insurance.",
                    }
                ],
            )

            unsupported = client.post(
                "/api/chat", json={"message": "What is the CEO's favorite color?"}
            )
            self.assertEqual(unsupported.status_code, 200)
            self.assertEqual(
                unsupported.json(),
                {"answer": rag_service.INSUFFICIENT_INFORMATION_ANSWER, "sources": []},
            )
            indexed = client.get("/api/documents")
            self.assertEqual(indexed.status_code, 200)
            self.assertEqual(indexed.json(), {"documents": documents})

    def test_ollama_requests_and_parses_explicit_evidence_status(self):
        for sufficient in [True, False]:
            with self.subTest(sufficient=sufficient):
                generated = {
                    "answer": "A grounded answer or an explanation of missing evidence.",
                    "has_sufficient_evidence": sufficient,
                    "supporting_source_ids": [1] if sufficient else [],
                }
                body = {"message": {"content": json.dumps(generated)}}
                with patch("app.rag_service.urllib.request.urlopen") as request:
                    request.return_value.__enter__.return_value.read.return_value = (
                        json.dumps(body).encode("utf-8")
                    )
                    result = rag_service._call_ollama([], source_count=2)

                self.assertEqual(result, generated)
                payload = json.loads(request.call_args.args[0].data)
                self.assertEqual(payload["format"]["type"], "object")
                self.assertEqual(
                    payload["format"]["properties"]["supporting_source_ids"]["items"][
                        "enum"
                    ],
                    [1, 2],
                )
                self.assertEqual(
                    payload["format"]["required"],
                    ["answer", "has_sufficient_evidence", "supporting_source_ids"],
                )

    def test_ollama_rejects_missing_or_invalid_evidence_status(self):
        for content in [
            "An unstructured answer",
            json.dumps({"answer": "Answer"}),
            json.dumps({"answer": "Answer", "has_sufficient_evidence": "false"}),
            json.dumps({"answer": " ", "has_sufficient_evidence": True}),
            json.dumps({"answer": "Answer", "has_sufficient_evidence": True}),
            *[
                json.dumps(
                    {
                        "answer": "Answer",
                        "has_sufficient_evidence": True,
                        "supporting_source_ids": source_ids,
                    }
                )
                for source_ids in [None, "1", [True], [0], [-1], [1.5], ["1"], [24]]
            ],
        ]:
            with self.subTest(content=content):
                body = {"message": {"content": content}}
                with patch("app.rag_service.urllib.request.urlopen") as request:
                    request.return_value.__enter__.return_value.read.return_value = (
                        json.dumps(body).encode("utf-8")
                    )
                    with self.assertRaises(rag_service.LLMServiceError):
                        rag_service._call_ollama([], source_count=2)

    def test_answer_builds_source_context_before_generation(self):
        results = {
            "documents": [["First passage", "Second passage", "Unrelated passage"]],
            "metadatas": [
                [
                    {"document": "guide.pdf", "page": 2},
                    {"document": "guide.pdf", "page": 3},
                    {"document": "unrelated.pdf", "page": 1},
                ]
            ],
            "distances": [[0.2, 0.3, rag_service.MAX_RETRIEVAL_DISTANCE + 0.1]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service._call_ollama",
                return_value={
                    "answer": "Answer [Source 1]",
                    "has_sufficient_evidence": True,
                    "supporting_source_ids": [1],
                },
            ) as generate,
        ):
            result = rag_service.answer_question(
                "What is covered?", [{"role": "user", "content": "Earlier question"}]
            )

        self.assertEqual(result["answer"], "Answer [Source 1]")
        self.assertEqual(
            result["sources"],
            [
                {"filename": "guide.pdf", "page": 2, "excerpt": "First passage"},
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

    def test_answer_selects_supporting_pages_and_renumbers_citations(self):
        results = {
            "documents": [
                [
                    "Office hours are 9 to 5.",
                    "Annual salary is $50,000.",
                    "Employees receive health insurance.",
                    "Salaries are paid monthly.",
                ]
            ],
            "metadatas": [
                [
                    {"document": "guide.pdf", "page": 1},
                    {"document": "pay.pdf", "page": 8},
                    {"document": "guide.pdf", "page": 2},
                    {"document": "pay.pdf", "page": 8},
                ]
            ],
            "distances": [[0.1, 0.2, 0.3, 0.4]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service._call_ollama",
                return_value={
                    "answer": "Health insurance [Source 3]; $50,000 annually [Source 2].",
                    "has_sufficient_evidence": True,
                    "supporting_source_ids": [3, 2, 2],
                },
            ),
        ):
            result = rag_service.answer_question("What are the salary and benefits?")

        self.assertEqual(
            result["answer"],
            "Health insurance [Source 2]; $50,000 annually [Source 1].",
        )
        self.assertEqual(
            result["sources"],
            [
                {
                    "filename": "pay.pdf",
                    "page": 8,
                    "excerpt": "Annual salary is $50,000.\n\nSalaries are paid monthly.",
                },
                {
                    "filename": "guide.pdf",
                    "page": 2,
                    "excerpt": "Employees receive health insurance.",
                },
            ],
        )

    def test_answer_selects_evidence_without_inline_citation_markers(self):
        results = {
            "documents": [["Leave is discussed here.", "Annual leave is 20 days."]],
            "metadatas": [
                [
                    {"document": "guide.pdf", "page": 1},
                    {"document": "guide.pdf", "page": 8},
                ]
            ],
            "distances": [[0.1, 0.2]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service._call_ollama",
                return_value={
                    "answer": "20 days",
                    "has_sufficient_evidence": True,
                    "supporting_source_ids": [2],
                },
            ),
        ):
            result = rag_service.answer_question("How many days of annual leave?")

        self.assertEqual(result["answer"], "20 days")
        self.assertEqual(
            result["sources"],
            [
                {
                    "filename": "guide.pdf",
                    "page": 8,
                    "excerpt": "Annual leave is 20 days.",
                }
            ],
        )

    def test_answer_rejects_missing_unknown_or_inconsistent_supporting_sources(self):
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
        for source_ids, answer in [
            ([], "Answer"),
            ([3], "Answer [Source 3]"),
            ([1], "Answer [Source 2]"),
        ]:
            with self.subTest(source_ids=source_ids, answer=answer):
                with (
                    patch("app.chroma_store.search_chunks", return_value=results),
                    patch(
                        "app.rag_service._call_ollama",
                        return_value={
                            "answer": answer,
                            "has_sufficient_evidence": True,
                            "supporting_source_ids": source_ids,
                        },
                    ) as generate,
                ):
                    with self.assertRaises(rag_service.LLMServiceError):
                        rag_service.answer_question("What is covered?")
                self.assertEqual(generate.call_count, 2)

    def test_chat_retries_pdf_page_number_as_source_id(self):
        results = {
            "documents": [["A good score is 670-739.", "Credit scoring overview."]],
            "metadatas": [
                [
                    {"document": "experian-credit-guide.pdf", "page": 24},
                    {"document": "transunion.pdf", "page": 3},
                ]
            ],
            "distances": [[0.2, 0.3]],
        }
        invalid = {
            "answer": "670-739",
            "has_sufficient_evidence": True,
            "supporting_source_ids": [24],
        }
        for corrected in [
            {
                "answer": "670-739 [Source 1]",
                "has_sufficient_evidence": True,
                "supporting_source_ids": [1],
            },
            {
                "answer": "Insufficient evidence.",
                "has_sufficient_evidence": False,
                "supporting_source_ids": [],
            },
        ]:
            with self.subTest(sufficient=corrected["has_sufficient_evidence"]):
                with (
                    patch("app.chroma_store.search_chunks", return_value=results),
                    patch("app.rag_service.urllib.request.urlopen") as request,
                ):
                    request.return_value.__enter__.return_value.read.side_effect = [
                        json.dumps({"message": {"content": json.dumps(output)}}).encode(
                            "utf-8"
                        )
                        for output in [invalid, corrected]
                    ]
                    response = TestClient(app).post(
                        "/api/chat", json={"message": "What is good score?"}
                    )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(request.call_count, 2)
                for call in request.call_args_list:
                    payload = json.loads(call.args[0].data)
                    self.assertEqual(
                        payload["format"]["properties"]["supporting_source_ids"][
                            "items"
                        ]["enum"],
                        [1, 2],
                    )
                self.assertIn(
                    "not PDF page numbers", payload["messages"][-1]["content"]
                )
                if corrected["has_sufficient_evidence"]:
                    self.assertEqual(response.json()["answer"], corrected["answer"])
                    self.assertEqual(
                        response.json()["sources"],
                        [
                            {
                                "filename": "experian-credit-guide.pdf",
                                "page": 24,
                                "excerpt": "A good score is 670-739.",
                            }
                        ],
                    )
                else:
                    self.assertEqual(
                        response.json(),
                        {
                            "answer": rag_service.INSUFFICIENT_INFORMATION_ANSWER,
                            "sources": [],
                        },
                    )

    def test_answer_does_not_retry_ollama_connection_errors(self):
        results = {
            "documents": [["A good score is 670-739."]],
            "metadatas": [[{"document": "experian-credit-guide.pdf", "page": 24}]],
            "distances": [[0.2]],
        }
        with (
            patch("app.chroma_store.search_chunks", return_value=results),
            patch(
                "app.rag_service.urllib.request.urlopen",
                side_effect=rag_service.urllib.error.URLError("Connection refused"),
            ) as request,
        ):
            with self.assertRaisesRegex(rag_service.LLMServiceError, "Unable to reach"):
                rag_service.answer_question("What is good score?")

        request.assert_called_once()

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

    def test_delete_document_removes_index_and_preserves_storage_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            stored_file = Path(temp_dir) / "folder" / "guide.pdf"
            stored_file.parent.mkdir()
            stored_file.write_bytes(b"pdf bytes")
            with (
                patch.object(rag_service, "DOCUMENTS_DIR", Path(temp_dir)),
                patch("app.chroma_store.remove_document", return_value=True) as remove,
            ):
                self.assertTrue(rag_service.delete_document("folder/guide.pdf"))

            remove.assert_called_once_with("folder/guide.pdf")
            self.assertTrue(stored_file.exists())
            self.assertEqual(stored_file.read_bytes(), b"pdf bytes")
            self.assertTrue(stored_file.parent.exists())

    def test_clear_all_removes_index_and_preserves_all_storage_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            first = root / "one.pdf"
            second = root / "folder" / "two.pdf"
            second.parent.mkdir()
            first.write_bytes(b"one")
            second.write_bytes(b"two")
            with (
                patch.object(rag_service, "DOCUMENTS_DIR", root),
                patch(
                    "app.chroma_store.clear_documents",
                    return_value=["one.pdf", "folder/two.pdf"],
                ) as clear,
            ):
                deleted_count = rag_service.clear_all_documents()

            self.assertEqual(deleted_count, 2)
            self.assertEqual(first.read_bytes(), b"one")
            self.assertEqual(second.read_bytes(), b"two")
            clear.assert_called_once_with()


if __name__ == "__main__":
    unittest.main()
