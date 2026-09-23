# RAG Application Testing Documentation: Credit Bureau Multi-Doc Setup

This document serves as the testing framework and dataset guide for evaluating our Retrieval-Augmented Generation (RAG) application. The project evaluates RAG capabilities by scaling from a **single-document baseline** to a **multi-document cross-reference system** using official, publicly available credit reporting documentation from the "Big Three" bureaus.

---

## 🎯 Project Narrative & Presentation Hook

> *"Lenders look at all three major credit bureaus, but their specific rules and reporting data vary. This testing pipeline demonstrates how our RAG app scales from parsing a single, structured agency guide into a comprehensive, multi-document intelligence system capable of cross-referencing multi-agency reporting rules simultaneously."*

---

## 📂 Document Catalog

The testing catalog consists of three official, publicly available PDFs representing each of the main credit bureaus.

### 1. Document #1: Experian (Single-Document Baseline)
*   **File Name:** `experian-credit-guide.pdf`
*   **Source:** Official Experian Public Education Portal
*   **Download URL:** [Experian Ultimate Field Guide](https://www.experian.com/blogs/ask-experian/wp-content/pdf/experian-credit-guide.pdf")
*   **Length:** ~15–20 pages
*   **Core Utility:** Explains credit score calculations, positive vs. negative impact factors, and credit-building strategies. Ideal for initial baseline testing of chunking strategies and semantic retrieval.

### 2. Document #2: Equifax US (Multi-Doc Expansion)
*   **File Name:** `Understanding_Your_Credit_Journey_EN_eBook.pdf`
*   **Source:** Official Equifax US Education Portal
*   **Download URL:** [Equifax US Credit Journey Guide](https://assets.equifax.com/assets/eBooks/Understanding_Your_Credit_Journey_EN_eBook.pdf)
*   **Length:** ~15 pages
*   **Core Utility:** An official US consumer blueprint detailing how credit scores are explicitly calculated, what variables are strictly barred from calculations under US law, and an analytical comparison of behaviors that impact consumer risk ratings.advanced technology impacts modern lender risk parameters.

### 3. Document #3: TransUnion (Multi-Doc Expansion)
*   **File Name:** `transunion-vantagescore-whitepaper.pdf`
*   **Source:** TransUnion Financial Services Resources
*   **Download URL:** [TransUnion VantageScore White Paper](https://www.transunion.com/docs/rev/business/financialservices/vantageScore_2.0_White_Paper_FINAL.PDF)
*   **Length:** ~10-15 pages
*   **Core Utility:** Outlines the joint-venture algorithm used across bureaus, detailing how consumer behavior over relevant timeframes impacts risk modeling. Excellent for testing data-heavy queries.

---

## 🎯 Test Queries & Presentation Demo Questions

Use these predefined questions during your live demonstration to prove the system's accuracy and multi-document intelligence.

### Level 1: Single-Document Validation (Querying Experian Only)
*   **Question 1:** *"What are the primary factors used to calculate a credit score?"*
    *   *Expected behavior:* The app should cleanly extract the percentage breakdowns (e.g., payment history, amounts owed) from the Experian guide.
*   **Question 2:** *"How long do negative items usually stay on my credit report?"*
    *   *Expected behavior:* The system should isolate specific numerical durations (e.g., 7 years for late payments, 10 years for certain bankruptcies).

### Level 2: Multi-Document Intelligence (Querying the Full Catalog)
*   **Question 3:** *"Do all three credit bureaus always have the exact same information about me?"*
    *   *Presentation Highlight:* **Cross-Document Synthesis**. 
    *   *Expected behavior:* The RAG app must pull from the Equifax and Experian guides to explain that credit reporting is entirely voluntary for lenders, meaning some lenders may report to only one or two bureaus instead of all three—proving the system is accurately reading multiple sources.
*   **Question 4:** *"What are the 'reason codes' mentioned in the Equifax documentation, and what do they indicate?"*
    *   *Presentation Highlight:* **Contextual Prioritization**.
    *   *Expected behavior:* The system should bypass the general Experian/TransUnion text and pinpoint the explicit Equifax layout stating that up to four reason codes accompany a risk score to indicate the main reasons for that score.
