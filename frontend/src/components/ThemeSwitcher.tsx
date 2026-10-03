interface ThemeSwitcherProps {
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

export default function ThemeSwitcher({ theme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <div className="flex items-center rounded-md border border-border bg-secondary p-0.5" aria-label="Color theme">
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        aria-label="Use light modern theme"
        aria-pressed={theme === 'light'}
        title="Light modern"
        className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${theme === 'light' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        aria-label="Use dark modern theme"
        aria-pressed={theme === 'dark'}
        title="Dark modern"
        className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${theme === 'dark' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <MoonIcon />
      </button>
    </div>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.75" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25m10.5 0h1.25M3.4 3.4l.9.9m7.4 7.4.9.9m0-9.2-.9.9m-7.4 7.4-.9.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.25 10.15A5.75 5.75 0 0 1 5.85 2.75a5.75 5.75 0 1 0 7.4 7.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
