import gekaAvatar from "../assets/avatar.png";
import CopyButton from "./CopyButton";
import SourceCard from "./SourceCard";

export interface Source {
  filename: string;
  page?: number;
  excerpt?: string;
}

export interface Answer {
  question: string;
  text: string;
  sources: Source[];
}

interface AnswerCardProps {
  answer: Answer;
}

export default function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div>
      {/* Question echo */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-6 h-6 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center mt-0.5">
          <span
            className="text-card text-[10px] font-semibold"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            U
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <p
            className="flex-1 text-sm font-medium text-foreground leading-relaxed pt-0.5"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {answer.question}
          </p>
          <CopyButton text={answer.question} label="Copy question" compact />
        </div>
      </div>

      {/* Answer */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {/* Answer header */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
          {/* GEKA robot avatar — no circle frame */}
          <img src={gekaAvatar} alt="GEKA" className="w-7 h-7 object-contain flex-shrink-0" />
          <span
            className="text-xs font-semibold tracking-widest uppercase text-primary"
            style={{ fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}
          >
            Answer
          </span>
          <span
            className="ml-auto text-[10px] text-subtle-foreground"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {answer.sources.length} source{answer.sources.length !== 1 ? "s" : ""}
          </span>
          <CopyButton text={answer.text} label="Copy answer" />
        </div>

        {/* Answer body */}
        <div className="px-5 py-4">
          <p
            className="text-[15px] text-foreground leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {answer.text}
          </p>
        </div>

        <div className="mx-5 mb-2 h-px bg-border" />

        {/* Sources */}
        <div className="px-5 pb-5 pt-3">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-2.5"
            style={{ fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}
          >
            Sources
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {answer.sources.map((s, i) => (
              <SourceCard
                key={i}
                filename={s.filename}
                page={s.page}
                excerpt={s.excerpt}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
