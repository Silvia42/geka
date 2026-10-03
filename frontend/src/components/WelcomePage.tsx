import welcomeImage from '../assets/welcome-image.png'
import Disclaimer from './Disclaimer'
import ThemeSwitcher from './ThemeSwitcher'

interface WelcomePageProps {
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  onOpenHelp: () => void
  onEnter: () => void
}

export default function WelcomePage({ theme, onThemeChange, onOpenHelp, onEnter }: WelcomePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border px-5 md:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            G
          </span>
          <span className="text-base font-bold tracking-tight">GEKA</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary" style={{ fontFamily: 'DM Mono, monospace' }}>
              Grounded knowledge, ready when you are
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
              Ask your documents.
              <span className="block text-primary">Get answers you can verify.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              GEKA turns your PDF library into a private knowledge workspace, providing clear AI-generated answers grounded in citations from your own documents.
            </p>

            <button
              type="button"
              onClick={onEnter}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors"
            >
              Open knowledge workspace
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              {['Local document workflow', 'Source-backed answers', 'No account required'].map(item => (
                <span key={item} className="flex items-center gap-2">
                  <svg className="text-accent" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                    <path d="m5 8 2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-primary-soft opacity-80 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-xl">
              <img
                src={welcomeImage}
                alt="GEKA — Grounded Enterprise Knowledge Assistant"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>

        <Disclaimer />
      </main>
    </div>
  )
}
