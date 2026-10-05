import CopyButton from './CopyButton'

interface QuestionInputProps {
  value: string
  onChange: (v: string) => void
  onAsk: () => void
  loading: boolean
}

export default function QuestionInput({ value, onChange, onAsk, loading }: QuestionInputProps) {
  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      if (!loading && value.trim()) onAsk()
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask a question about your documents..."
        rows={3}
        className="w-full px-4 pt-4 pb-2 text-[15px] text-foreground placeholder:text-subtle-foreground resize-none outline-none bg-transparent leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
      <div className="flex items-center justify-between px-4 pb-3">
        <p className="text-[11px] text-subtle-foreground" style={{ fontFamily: 'DM Mono, monospace' }}>
          Press Enter to ask · Shift+Enter for newline
        </p>
        <div className="flex items-center gap-1.5">
          <CopyButton text={value} label="Copy question" compact />
          <button
            onClick={onAsk}
            disabled={loading || !value.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {loading ? 'Asking...' : 'Ask'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
