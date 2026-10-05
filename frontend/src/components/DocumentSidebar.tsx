import { useEffect, useState } from "react";
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

export default function DocumentSidebar({ onDocumentsChange }: DocumentSidebarProps) {
  const [picker, setPicker] = useState<"documents" | "folder" | null>(null);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="px-4 pt-5 pb-3">
          <h2
            className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
            style={{ fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}
          >
            Documents
          </h2>
        </div>

        <div className="px-2 flex-1 overflow-y-auto scroll-area">
          {documents.map((document) => (
            <DocumentItem
              key={document.filename}
              filename={document.filename}
              pages={document.pages}
              status="indexed"
              active
            />
          ))}
          {error && (
            <p role="alert" className="px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
          {!error && documents.length === 0 && (
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
    </>
  );
}
