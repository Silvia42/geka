import gekaAvatar from '../assets/avatar.png'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src={gekaAvatar}
        alt="GEKA assistant"
        className="w-20 h-20 object-contain"
      />
      <h2 className="text-xl font-semibold text-foreground mt-5 mb-2"
          style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Ask GEKA anything about your documents
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
        Upload a document and ask a question to get a grounded answer with sources.
      </p>

      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {[
          'What are the key findings?',
          'Summarize the main topics',
          'What factors are discussed?',
        ].map(q => (
          <button
            key={q}
            className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground-soft hover:border-border-strong hover:text-primary hover:bg-primary-soft transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
