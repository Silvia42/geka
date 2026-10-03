import { useEffect, useState } from 'react'

interface DocumentPickerModalProps {
  mode: 'documents' | 'folder'
  onClose: () => void
}

export default function DocumentPickerModal({ mode, onClose }: DocumentPickerModalProps) {
  const [selection, setSelection] = useState<File[]>([])
  const isFolder = mode === 'folder'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const directoryAttributes = isFolder
    ? ({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)
    : {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-picker-title"
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xl"
      >
        <div className="flex items-start gap-4 border-b border-border px-5 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            {isFolder ? <FolderIcon /> : <UploadIcon />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="document-picker-title" className="text-base font-semibold text-foreground">
              {isFolder ? 'Select a document folder' : 'Upload documents'}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isFolder
                ? 'Choose a local folder. GEKA will find the PDF documents inside it.'
                : 'Choose one or more PDF documents to add to your knowledge base.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle px-6 py-6 text-center hover:border-primary hover:bg-primary-soft transition-colors">
            <input
              type="file"
              accept={isFolder ? undefined : 'application/pdf,.pdf'}
              multiple
              className="sr-only"
              onChange={event => setSelection(Array.from(event.target.files ?? []))}
              {...directoryAttributes}
            />
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary shadow-sm">
              {isFolder ? <FolderIcon /> : <UploadIcon />}
            </span>
            <span className="text-sm font-semibold text-primary">
              {isFolder ? 'Choose folder from disk' : 'Choose PDF files'}
            </span>
            <span className="mt-1 text-xs text-subtle-foreground">
              {isFolder ? 'PDF files in the selected folder will be included' : 'Multiple files can be selected'}
            </span>
          </label>

          {selection.length > 0 && (
            <div className="mt-4 rounded-lg bg-secondary px-3.5 py-3">
              <p className="text-sm font-medium text-foreground">
                {selection.length} document{selection.length === 1 ? '' : 's'} selected
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isFolder
                  ? selection[0].webkitRelativePath.split('/')[0] || 'Selected folder'
                  : selection.map(file => file.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-surface-subtle px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground-soft hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selection.length === 0}
            onClick={onClose}
            className="rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            {selection.length > 0
              ? `Add ${selection.length} document${selection.length === 1 ? '' : 's'}`
              : 'Add documents'}
          </button>
        </div>
      </div>
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 12V3m0 0L5.5 6.5M9 3l3.5 3.5M3 13.5V15h12v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2.5 5.25h5l1.25 1.5h6.75v7.5a1.25 1.25 0 0 1-1.25 1.25H3.75a1.25 1.25 0 0 1-1.25-1.25v-9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M2.5 5.25V3.75h4l1.25 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
