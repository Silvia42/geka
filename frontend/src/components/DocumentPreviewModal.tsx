import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Source } from "./AnswerCard";

interface DocumentPreviewModalProps {
  source: Source;
  onClose: () => void;
}

export default function DocumentPreviewModal({ source, onClose }: DocumentPreviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const page = source.page ?? 1;
  const endpoint = `/api/document/preview?filename=${encodeURIComponent(source.filename)}`;
  const directUrl = `${endpoint}#page=${page}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;
    setPdfUrl(null);
    setError(null);

    async function loadPdf() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "The source PDF is no longer available on disk."
              : `Unable to load PDF (${response.status}).`,
          );
        }
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load PDF.");
        }
      }
    }

    void loadPdf();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [endpoint]);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby="document-preview-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
      className="m-auto flex h-[min(90dvh,900px)] w-[calc(100%-2rem)] max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-overlay"
    >
      <header className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 id="document-preview-title" className="break-all text-base font-semibold">
            {source.filename}
          </h2>
          <p
            className="mt-1 text-xs text-muted-foreground"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Page {page}
          </p>
        </div>
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md border border-border px-3 py-2 text-xs text-primary hover:bg-primary-soft"
        >
          Open PDF
        </a>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close document preview"
          title="Close document preview"
          className="h-8 w-8 shrink-0 rounded-md text-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      {source.excerpt && (
        <section className="max-h-48 shrink-0 overflow-y-auto border-b border-border bg-surface-subtle px-5 py-4">
          <h3 className="mb-2 text-xs font-semibold text-primary">Retrieved passage</h3>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground-soft">
            {source.excerpt}
          </p>
        </section>
      )}
      <div className="min-h-0 flex-1 bg-secondary">
        {error ? (
          <p role="alert" className="px-5 py-4 text-sm text-error">
            {error}
          </p>
        ) : pdfUrl ? (
          <iframe
            title={`${source.filename}, page ${page}`}
            src={`${pdfUrl}#page=${page}&view=FitH`}
            className="h-full w-full border-0"
          />
        ) : (
          <p role="status" className="px-5 py-4 text-sm text-muted-foreground">
            Loading PDF...
          </p>
        )}
      </div>
    </dialog>,
    document.querySelector("[data-theme]") ?? document.body,
  );
}
