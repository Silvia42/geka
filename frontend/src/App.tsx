import { useState } from "react";
import Header from "./components/Header";
import DocumentSidebar from "./components/DocumentSidebar";
import QuestionInput from "./components/QuestionInput";
import AnswerCard from "./components/AnswerCard";
import EmptyState from "./components/EmptyState";
import HelpModal from "./components/HelpModal";
import WelcomePage from "./components/WelcomePage";
import Disclaimer from "./components/Disclaimer";

const MOCK_ANSWER = {
  question: "What factors affect a person's credit score?",
  text: "Several factors can affect a person's credit score, including payment history, amounts owed, length of credit history, types of credit accounts, and recent credit activity. Payment history is typically the most significant factor, as lenders want to know whether you pay your bills on time. The amount of debt you carry relative to your credit limit — known as credit utilization — is also heavily weighted.",
  sources: [
    { filename: "experian-credit-guide.pdf", page: 8 },
    { filename: "experian-credit-guide.pdf", page: 9 },
  ],
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [answered, setAnswered] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem("geka-theme") === "dark" ? "dark" : "light",
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [page, setPage] = useState<"welcome" | "workspace">("welcome");

  function handleAsk() {
    if (question.trim()) setAnswered(true);
  }

  function handleThemeChange(nextTheme: "light" | "dark") {
    setTheme(nextTheme);
    localStorage.setItem("geka-theme", nextTheme);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors"
      data-theme={theme}
    >
      {page === "welcome" ? (
        <WelcomePage
          theme={theme}
          onThemeChange={handleThemeChange}
          onOpenHelp={() => setHelpOpen(true)}
          onEnter={() => setPage("workspace")}
        />
      ) : (
        <>
          <Header
            docCount={1}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            theme={theme}
            onThemeChange={handleThemeChange}
            onOpenHelp={() => setHelpOpen(true)}
          />

          <div className="flex h-[calc(100vh-56px)]">
            {/* Sidebar overlay on mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-overlay z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Left sidebar */}
            <aside
              className={[
                "fixed md:static z-30 md:z-auto top-14 left-0 h-[calc(100vh-56px)] w-64 flex-shrink-0",
                "bg-card border-r border-border flex flex-col transition-transform duration-200",
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              ].join(" ")}
            >
              <DocumentSidebar />
            </aside>

            {/* Main content */}
            <main className="flex flex-1 flex-col overflow-y-auto scroll-area px-6 py-8 md:px-10 lg:px-16">
              <div className="mx-auto w-full max-w-2xl flex-1">
                {/* Page heading */}
                <div className="mb-8">
                  <p
                    className="text-xs font-medium tracking-widest uppercase text-primary mb-2"
                    style={{ fontFamily: "DM Mono, monospace", letterSpacing: "0.12em" }}
                  >
                    Knowledge Assistant
                  </p>
                  <h1
                    className="text-3xl font-semibold text-foreground mb-2 leading-tight"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    Ask questions about your documents
                  </h1>
                  <p
                    className="text-muted-foreground text-base"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    GEKA searches your documents and provides answers with source references.
                  </p>
                </div>

                {/* Question input */}
                <QuestionInput value={question} onChange={setQuestion} onAsk={handleAsk} />

                {/* Answer or empty state */}
                <div className="mt-8 pb-10">
                  {answered ? <AnswerCard answer={MOCK_ANSWER} /> : <EmptyState />}
                </div>
              </div>
              <Disclaimer />
            </main>
          </div>
        </>
      )}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
