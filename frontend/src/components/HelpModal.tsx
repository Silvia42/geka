import { useEffect } from 'react'
import gekaAvatar from '../assets/avatar.png'

interface HelpModalProps {
  onClose: () => void
}

export default function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
        aria-labelledby="help-title"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-xl"
      >
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <img src={gekaAvatar} alt="" className="h-10 w-10 flex-shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary" style={{ fontFamily: 'DM Mono, monospace' }}>
              Help center
            </p>
            <h2 id="help-title" className="mt-1 text-lg font-semibold">
              How GEKA works
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
            GEKA is a Grounded Enterprise Knowledge Assistant. It searches the PDF documents you select and returns clear answers supported by references to the original source pages.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['1', 'Add documents', 'Upload PDFs or select a local document folder.'],
              ['2', 'Ask a question', 'Enter a question using natural language.'],
              ['3', 'Check sources', 'Review the cited documents and page numbers.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-lg border border-border bg-surface-subtle p-3.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
                  {number}
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-primary-soft px-4 py-3 text-sm text-foreground-soft">
            <strong className="font-semibold text-primary">Grounded answers:</strong>{' '}
            GEKA only answers from the documents available in your workspace, helping you verify every response.
          </div>
        </div>

        <div className="flex justify-end border-t border-border bg-surface-subtle px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
