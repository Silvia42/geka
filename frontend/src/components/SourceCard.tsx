interface SourceCardProps {
  filename: string
  page: number
  index: number
}

export default function SourceCard({ filename, page, index }: SourceCardProps) {
  return (
    <a
      href="#"
      className="flex items-center gap-3 px-3.5 py-3 bg-card border border-border rounded-md hover:border-border-strong hover:bg-primary-soft transition-colors group"
      onClick={e => e.preventDefault()}
    >
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-muted text-primary text-[10px] font-semibold flex items-center justify-center"
        style={{ fontFamily: 'DM Mono, monospace' }}
      >
        {index}
      </span>

      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
        <path d="M2 1h7l4 4v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
              stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2"/>
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
          {filename}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>
          Page {page}
        </p>
      </div>

      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 text-subtle-foreground group-hover:text-primary transition-colors">
        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}
