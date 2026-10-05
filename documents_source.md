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



# RAG Application Testing Documentation: Accenture Global Ethics & Compliance Multi-Doc Setup

This document serves as the testing framework and dataset guide for evaluating our Retrieval-Augmented Generation (RAG) application. The project evaluates RAG capabilities by scaling from a **single-document baseline** to a **multi-document cross-reference system** using official, publicly available corporate conduct and regulatory compliance documentation from Accenture (ACN).

---

## 🎯 Project Narrative & Presentation Hook

> *"Global consultancies must navigate general corporate governance alongside hyper-specific federal procurement regulations. This testing pipeline demonstrates how our RAG app scales from parsing a single, foundational Code of Business Ethics brochure into a comprehensive, multi-document intelligence system capable of cross-referencing global behavioral guidelines with specialized federal contracting laws simultaneously."*

---

## 📂 Document Catalog

The testing catalog consists of official, publicly available PDFs representing Accenture's core corporate governance and regulatory compliance frameworks.

### 1. Document #1: Accenture Global COBE (Single-Document Baseline)
*   **File Name:** `accenture-cobe-brochure-english.pdf`
*   **Source:** Accenture Investor Relations & Global Compliance Portal
*   **Download URL:** [Accenture Code of Business Ethics](https://www.accenture.com/content/dam/accenture/final/a-com-migration/pdf/pdf-63/accenture-cobe-brochure-english.pdf)
*   **Length:** ~10–12 pages
*   **Core Utility:** Details foundational global employee behavioral expectations, client protection values, data privacy, and global anti-corruption rules. Ideal for initial baseline testing of semantic text extraction, chunking integrity, and core vector retrieval.

### 2. Document #2: Accenture Federal Services Standards (Multi-Doc Expansion)
*   **File Name:** `accenture-afs-standards-federal-business-ethics-conduct.pdf`
*   **Source:** Accenture Federal Services (AFS) Compliance Directorate
*   **Download URL:** [Accenture Standards of Federal Business Ethics & Conduct](https://www.accenture.com/content/dam/accenture/final/a-com-migration/pdf/pdf-33/accenture-afs-standards-federal-business-ethics-conduct.pdf)
*   **Length:** ~15 pages
*   **Core Utility:** A specialized legal blueprint mapping out strict compliance requirements for employees interacting with U.S. Federal Government entities. Outlines Procurement Integrity Acts, strict bans on government gift exchanges, and mandatory timekeeping fraud disclosures.

### 3. Document #3: Accenture COBE At-A-Glance (Multi-Doc Expansion)
*   **File Name:** `accenture-cobe-at-a-glance-fy20-final-nov-2019.pdf`
*   **Source:** Accenture Internal Workforce Resources Portal
*   **Download URL:** [Accenture COBE Summary Reference Sheet](https://www.accenture.com/content/dam/accenture/final/a-com-migration/pdf/pdf-112/accenture-cobe-at-a-glance-fy20-final-nov-2019.pdf)
*   **Length:** ~2–4 pages
*   **Core Utility:** Outlines the core behavioral pillars in a highly dense, summarized format. Excellent for evaluating how the vector retriever ranks summary sheets versus extensive long-form policy manuals when facing broad queries.

### 4. Document #4: Accenture Case Interview Workbook (Multi-Doc Expansion)
*   **File Name:** `Accenture-FY19-Case-Workbook.pdf`
*   **Source:** Accenture Global Talent Acquisition & Recruitment Portal
*   **Download URL:** [Accenture Candidate Case Workbook](https://www.accenture.com/content/dam/accenture/final/a-com-migration/manual/r2-2-r2-3/pdf/careers/pdf-14/Accenture-FY19-Case-Workbook.pdf)
*   **Length:** ~15–20 pages
*   **Core Utility:** Outlines technical problem-solving frameworks, metric parameters, and analytical frameworks utilized by modern consultants. Tests the RAG system's capacity to isolate general business analysis formulas from corporate policy texts.

---

## 🎯 Test Queries & Presentation Demo Questions

Use these predefined questions during your live demonstration to prove the system's accuracy and multi-document intelligence.

### Level 1: Single-Document Validation (Querying Global COBE Only)
*   **Question 1:** *"What are the foundational core values and behaviors expected under Accenture's Code of Business Ethics?"*
    *   *Expected behavior:* The app should cleanly extract the specific core pillars (e.g., client value creation, data privacy rules, anti-corruption barriers) directly from the baseline Global COBE document.
*   **Question 2:** *"What is Accenture's explicit policy regarding the protection of insider information and stock trading?"*
    *   *Expected behavior:* The system should isolate the legal compliance definitions banning the use or sharing of non-public data for securities trading from the text blocks.

### Level 2: Multi-Document Intelligence (Querying the Full Catalog)
*   **Question 3:** *"How do the rules for giving gifts or hospitality differ between standard commercial clients and U.S. Federal Government clients?"*
    *   *Presentation Highlight:* **Cross-Document Synthesis**. 
    *   *Expected behavior:* The RAG app must simultaneously cross-reference the Global COBE text (which allows modest corporate hospitality) with the Federal Services PDF (which declares strict statutory dollar limits and bans on giving anything of value to public procurement officials). This demonstrates advanced multi-document logic.
*   **Question 4:** *"What specific reporting procedures must an employee follow under the Federal Services guidelines if a procurement integrity violation is suspected?"*
    *   *Presentation Highlight:* **Contextual Prioritization**.
    *   *Expected behavior:* The system must bypass general global reporting hotlines and extract the explicit, high-priority tracking layout mapped out inside the specialized Federal Services documentation for reporting contract or time-charging anomalies.
