import { useEffect, useState } from 'react'

interface CopyButtonProps {
  text: string
  label: string
  compact?: boolean
}

export default function CopyButton({ text, label, compact = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [copied])

  async function handleCopy() {
    if (!text.trim()) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text.trim()}
      aria-label={copied ? 'Copied to clipboard' : label}
      title={copied ? 'Copied' : label}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
        compact ? 'w-7 h-7 flex-shrink-0' : 'h-7 px-2 text-xs font-medium',
      ].join(' ')}
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5.25" y="5.25" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 5.25V4.5A1.5 1.5 0 0 0 9 3H4.5A1.5 1.5 0 0 0 3 4.5V9A1.5 1.5 0 0 0 4.5 10.5h.75" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )}
      {!compact && (copied ? 'Copied' : 'Copy')}
    </button>
  )
}
