interface StatusBadgeProps {
  label: string
  variant?: 'indexed' | 'processing' | 'error'
}

export default function StatusBadge({ label, variant = 'indexed' }: StatusBadgeProps) {
  const styles = {
    indexed: 'bg-primary-muted text-primary',
    processing: 'bg-warning-soft text-warning',
    error: 'bg-error-soft text-error',
  }
  const dots = {
    indexed: 'bg-primary',
    processing: 'bg-warning',
    error: 'bg-error',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${styles[variant]}`}
          style={{ fontFamily: 'DM Mono, monospace' }}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />
      {label}
    </span>
  )
}
