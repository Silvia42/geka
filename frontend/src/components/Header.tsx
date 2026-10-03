import gekaAvatar from '../assets/avatar.png'
import ThemeSwitcher from './ThemeSwitcher'

interface HeaderProps {
  docCount: number
  onToggleSidebar: () => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  onOpenHelp: () => void
}

export default function Header({ docCount, onToggleSidebar, theme, onThemeChange, onOpenHelp }: HeaderProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 md:px-6 gap-4 sticky top-0 z-40 transition-colors">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        onClick={onToggleSidebar}
        aria-label="Toggle documents"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="8.25" width="10" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src={gekaAvatar}
          alt="GEKA robot mascot"
          className="w-8 h-8 object-contain"
        />
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-foreground"
                style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
            GEKA
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:block"
                style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em' }}>
            Grounded Enterprise Knowledge Assistant
          </span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />

        <button
          type="button"
          onClick={onOpenHelp}
          aria-label="Open GEKA help"
          title="Help"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-border-strong hover:bg-primary-soft hover:text-primary transition-colors"
        >
          <span className="text-sm font-semibold">?</span>
        </button>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground"
             style={{ fontFamily: 'Inter, sans-serif' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2h6l3 3v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                  stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span className="hidden sm:inline">{docCount} document</span>
          <span className="sm:hidden">{docCount}</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold"
             style={{ fontFamily: 'DM Sans, sans-serif' }}>
          U
        </div>
      </div>
    </header>
  )
}
