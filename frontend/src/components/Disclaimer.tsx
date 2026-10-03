export default function Disclaimer() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-start gap-2.5 border-t border-border px-1 pb-1 pt-5 text-subtle-foreground">
      <svg className="mt-0.5 flex-shrink-0 text-warning" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M7.13 2.2 1.65 12a1 1 0 0 0 .87 1.5h10.96a1 1 0 0 0 .87-1.5L8.87 2.2a1 1 0 0 0-1.74 0Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8 5.5v3.25M8 11.25v.05" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <p className="text-[11px] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
        GEKA provides AI-generated answers based on the documents you provide. Answers may contain errors or incomplete information. Always review the cited sources and verify important information with a qualified professional.
      </p>
    </div>
  )
}
