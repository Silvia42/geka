import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DocumentItem from "./DocumentItem";
import DocumentPickerModal from "./DocumentPickerModal";
import UploadButton from "./UploadButton";

interface DocumentInfo {
  filename: string;
  pages: number;
}

interface DocumentSidebarProps {
  onDocumentsChange?: (count: number) => void;
}

type DeleteConfirmation = { kind: "document"; filename: string } | { kind: "all" };

export default function DocumentSidebar({ onDocumentsChange }: DocumentSidebarProps) {
  const [picker, setPicker] = useState<"documents" | "folder" | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingFilename, setDeletingFilename] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [confirmation, setConfirmation] = useState<DeleteConfirmation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents");
        if (!response.ok) throw new Error(`Could not load documents (${response.status})`);
        const data: unknown = await response.json();
        if (
          !data ||
          typeof data !== "object" ||
          !("documents" in data) ||
          !Array.isArray(data.documents)
        ) {
          throw new Error("Invalid documents response");
        }
        const items = data.documents.filter(
          (item): item is DocumentInfo =>
            !!item &&
            typeof item === "object" &&
            "filename" in item &&
            typeof item.filename === "string" &&
            "pages" in item &&
            typeof item.pages === "number",
        );
        if (!cancelled) {
          setDocuments(items);
          setError(null);
          onDocumentsChange?.(items.length);
        }
      } catch (loadError) {
        if (!cancelled)
          setError(loadError instanceof Error ? loadError.message : "Could not load documents");
      }
    }

    void loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, onDocumentsChange]);

  async function deleteDocument(filename: string) {
    setActionError(null);
    setDeletingFilename(filename);
    try {
      const response = await fetch(`/api/document?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const detail =
          body && typeof body === "object" && "detail" in body && typeof body.detail === "string"
            ? body.detail
            : `Delete failed (${response.status})`;
        throw new Error(detail);
      }
      setRefreshKey((key) => key + 1);
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error ? deleteError.message : "Could not delete document",
      );
    } finally {
      setDeletingFilename(null);
    }
  }

  async function clearAllDocuments() {
    setActionError(null);
    setClearing(true);
    try {
      const response = await fetch("/api/documents", { method: "DELETE" });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const detail =
          body && typeof body === "object" && "detail" in body && typeof body.detail === "string"
            ? body.detail
            : `Clear all failed (${response.status})`;
        throw new Error(detail);
      }
      setRefreshKey((key) => key + 1);
    } catch (clearError) {
      setActionError(
        clearError instanceof Error ? clearError.message : "Could not clear documents",
      );
    } finally {
      setClearing(false);
    }
  }

  function confirmDeletion() {
    if (!confirmation) return;

    const action = confirmation;
    setConfirmation(null);
    if (action.kind === "document") {
      void deleteDocument(action.filename);
    } else {
      void clearAllDocuments();
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <h2
              className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
              style={{ fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}
            >
              Documents
            </h2>
            <button
              type="button"
              onClick={() => setConfirmation({ kind: "all" })}
              disabled={documents.length === 0 || clearing || deletingFilename !== null}
              className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {clearing ? "Clearing..." : "Clear all"}
            </button>
          </div>
        </div>

        <div className="px-2 flex-1 overflow-y-auto scroll-area">
          {documents.map((document) => (
            <DocumentItem
              key={document.filename}
              filename={document.filename}
              pages={document.pages}
              onDelete={(filename) => setConfirmation({ kind: "document", filename })}
              deleting={clearing || deletingFilename === document.filename}
              status="indexed"
              active
            />
          ))}
          {(error || actionError) && (
            <p role="alert" className="px-3 py-2 text-xs text-red-700">
              {actionError || error}
            </p>
          )}
          {!error && !actionError && documents.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No indexed documents</p>
          )}
        </div>

        <div className="px-3 pb-4 pt-3 border-t border-border">
          <div className="space-y-2">
            <UploadButton onClick={() => setPicker("documents")} />
            <UploadButton variant="folder" onClick={() => setPicker("folder")} />
          </div>
          <p
            className="mt-3 text-[11px] text-subtle-foreground leading-relaxed px-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Your answers are grounded in the documents you upload.
          </p>
        </div>
      </div>

      {picker && (
        <DocumentPickerModal
          mode={picker}
          onClose={() => setPicker(null)}
          onUploaded={() => setRefreshKey((key) => key + 1)}
        />
      )}
      {confirmation && (
        <DocumentConfirmationDialog
          confirmation={confirmation}
          onCancel={() => setConfirmation(null)}
          onConfirm={confirmDeletion}
        />
      )}
    </>
  );
}

interface DocumentConfirmationDialogProps {
  confirmation: DeleteConfirmation;
  onCancel: () => void;
  onConfirm: () => void;
}

function DocumentConfirmationDialog({
  confirmation,
  onCancel,
  onConfirm,
}: DocumentConfirmationDialogProps) {
  const isClearAll = confirmation.kind === "all";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const portalRoot = document.querySelector("[data-theme]") ?? document.body;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xl"
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-error-soft text-error">
            <TrashIcon />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-error"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              Permanent deletion
            </p>
            <h2 id="delete-confirmation-title" className="mt-1 text-base font-semibold">
              {isClearAll ? "Clear all documents?" : "Delete this document?"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel deletion"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-3 px-5 py-5">
          {isClearAll ? (
            <p
              id="delete-confirmation-description"
              className="text-sm leading-relaxed text-muted-foreground"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              All indexed documents and their RAG data, including uploaded PDFs, extracted chunks,
              and vectors, will be permanently removed. This cannot be undone.
            </p>
          ) : (
            <>
              <p
                id="delete-confirmation-description"
                className="text-sm leading-relaxed text-muted-foreground"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to remove this document from GEKA? This unindexes its context
                from the RAG search matrix, but keeps the physical file safely on your hard drive.
              </p>
              <div className="rounded-md border border-border bg-surface-subtle px-3.5 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-subtle-foreground">
                  Document
                </p>
                <p className="mt-1 break-all text-sm font-medium text-foreground">
                  {confirmation.kind === "document" ? confirmation.filename : ""}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-surface-subtle px-5 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground-soft transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-error px-3.5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            {isClearAll ? "Clear all documents" : "Delete document"}
          </button>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4h11M6 4V2.5h4V4m2.5 0-.7 9H4.2l-.7-9m3 2.2v4.5m3-4.5v4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
