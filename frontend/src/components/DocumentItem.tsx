import StatusBadge from './StatusBadge'

interface DocumentItemProps {
  filename: string
  pages: number
  status?: 'indexed' | 'processing' | 'error'
  active?: boolean
}

export default function DocumentItem({
  filename,
  pages,
  status = 'indexed',
  active = false,
}: DocumentItemProps) {
  return (
    <button
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
    </button>
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
