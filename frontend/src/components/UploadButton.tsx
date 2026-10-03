interface UploadButtonProps {
  onClick: () => void
  variant?: 'upload' | 'folder'
}

export default function UploadButton({ onClick, variant = 'upload' }: UploadButtonProps) {
  const isFolder = variant === 'folder'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isFolder
          ? 'border border-border bg-card text-foreground-soft hover:bg-secondary hover:border-border-strong'
          : 'border border-dashed border-border-strong bg-primary-soft text-primary hover:bg-primary-muted hover:border-primary',
      ].join(' ')}
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    >
      {isFolder ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" aria-hidden="true">
          <path d="M2 4.75h4.25l1.25 1.5H14v6.25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M2 4.75V3.5h3.5l1.25 1.25" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0" aria-hidden="true">
          <path d="M7 1v9M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )}
      {isFolder ? 'Select document folder' : 'Upload documents'}
    </button>
  )
}
