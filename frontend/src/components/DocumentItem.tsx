import StatusBadge from './StatusBadge'

interface DocumentItemProps {
  filename: string
  pages: number
  onDelete: (filename: string) => void
  deleting?: boolean
  status?: 'indexed' | 'processing' | 'error'
  active?: boolean
}

export default function DocumentItem({
  filename,
  pages,
  onDelete,
  deleting = false,
  status = 'indexed',
  active = false,
}: DocumentItemProps) {
  return (
    <div
      className={[
        'w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-md transition-colors group',
        active
          ? 'bg-secondary text-foreground'
          : 'hover:bg-secondary text-foreground',
      ].join(' ')}
    >
      <span className="flex-shrink-0 mt-0.5">
        <PdfIcon active={active} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
          {filename}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted-foreground" style={{ fontFamily: 'DM Mono, monospace' }}>
            {pages} pages
          </span>
          <StatusBadge label="Indexed" variant={status} />
        </div>
      </div>
      <button
        type="button"
        title={`Delete ${filename}`}
        aria-label={`Delete ${filename}`}
        disabled={deleting}
        onClick={() => onDelete(filename)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-muted-foreground opacity-70 transition-opacity hover:bg-card hover:text-red-600 hover:opacity-100 focus:opacity-100 disabled:cursor-wait disabled:opacity-50"
      >
        {deleting ? (
          <span aria-hidden="true" className="text-xs">...</span>
        ) : (
          <TrashIcon />
        )}
      </button>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 4h11M6 4V2.5h4V4m2.5 0-.7 9H4.2l-.7-9m3 2.2v4.5m3-4.5v4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PdfIcon({ active }: { active?: boolean }) {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
      <rect x="0" y="0" width="28" height="32" rx="4" fill={active ? 'var(--geka-primary-muted)' : 'var(--geka-secondary)'} />
      <path d="M5 4h12l7 7v17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
            fill={active ? 'var(--geka-primary-subtle)' : 'var(--geka-border)'} />
      <path d="M17 4l7 7h-5a2 2 0 0 1-2-2V4z" fill={active ? 'var(--geka-primary)' : 'var(--geka-muted-foreground)'} opacity="0.5"/>
      <text x="4" y="27" fontSize="7" fontWeight="600" fill={active ? 'var(--geka-primary)' : 'var(--geka-muted-foreground)'}
            fontFamily="DM Mono, monospace">
        PDF
      </text>
    </svg>
  )
}
