import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SPECTRUM_COLORS } from "@/lib/specColorAt";

type PersonaId = "bb" | "bo" | "ia" | "ac";
type Pillar = "PERCEPTION" | "CLARITY" | "IDENTITY" | "CULTURE";

interface Question {
  q: number;
  pillar: Pillar;
  universal: boolean;
  text?: string;
  variants?: Record<PersonaId, string>;
}

const PERSONAS: { id: PersonaId; label: string; sub: string; color: string }[] = [
  { id: "bb", label: "BUSINESS BUILDERS", sub: "Solopreneur · First-time founder · Pre-revenue to ~$1M", color: "#4882ff" },
  { id: "bo", label: "BUSINESS OWNERS", sub: "Mid-market · $1-50M revenue · 10-200+ employees", color: "#c9a227" },
  { id: "ia", label: "INVESTORS + ACQUIRERS", sub: "PE firms · Acquirers · Evaluating portfolio brand health", color: "#5fcc00" },
  { id: "ac", label: "AGENCIES + CONSULTANTS", sub: "Marketing agencies · Fractional executives · Assessing clients", color: "#7c3aed" },
];

const QUESTIONS: Question[] = [
  { q: 1, pillar: "PERCEPTION", universal: true, text: "Do your customers clearly understand what your brand stands for?" },
  { q: 2, pillar: "PERCEPTION", universal: false, variants: {
    bb: "Can your customers, partners, or collaborators describe your brand the same way you do?",
    bo: "Do your employees describe your brand the same way your leadership team does?",
    ia: "Can the portfolio company's employees describe the brand the same way leadership does?",
    ac: "Can your team describe your agency's brand the same way your founders do?",
  }},
  { q: 3, pillar: "PERCEPTION", universal: false, variants: {
    bb: "Have you personally surveyed at least 5 customers in the last 12 months about how they perceive your brand?",
    bo: "Have you conducted a formal customer perception survey in the last 12 months?",
    ia: "Has the target company conducted a customer perception survey in the last 12 months?",
    ac: "Have you conducted a client perception survey of your own agency in the last 12 months?",
  }},
  { q: 4, pillar: "PERCEPTION", universal: true, text: "Is the way you describe your company consistent across your website, proposals, and sales conversations?" },
  { q: 5, pillar: "PERCEPTION", universal: true, text: "Can you name 3 specific things clients say they value about your company that competitors do not offer?" },
  { q: 6, pillar: "CLARITY", universal: true, text: "Do you have a written one-sentence description of what your company does that every employee has memorized?" },
  { q: 7, pillar: "CLARITY", universal: true, text: "Is your pricing structure clear enough that a new employee could explain it in their first week?" },
  { q: 8, pillar: "CLARITY", universal: true, text: "Do prospects understand what you do within 30 seconds of seeing your homepage?" },
  { q: 9, pillar: "CLARITY", universal: true, text: "Is your value proposition differentiated from your top 3 competitors in a way you could defend?" },
  { q: 10, pillar: "CLARITY", universal: true, text: "Do you have a documented reason why clients choose you over alternatives backed by client data?" },
  { q: 11, pillar: "IDENTITY", universal: true, text: "Is your visual brand (logo, colors, typography) consistent across every touchpoint?" },
  { q: 12, pillar: "IDENTITY", universal: true, text: "Would a prospect recognize your brand from a business card without seeing your company name?" },
  { q: 13, pillar: "IDENTITY", universal: true, text: "Has your brand been professionally designed (not DIY or template-based)?" },
  { q: 14, pillar: "IDENTITY", universal: true, text: "Do you have brand guidelines that are actively enforced?" },
  { q: 15, pillar: "IDENTITY", universal: false, variants: {
    bb: "Is your personal brand consistent with your business brand across LinkedIn, website, and pitch materials?",
    bo: "Is your internal brand experience (office, onboarding, culture) consistent with your external brand?",
    ia: "Is the target company's internal brand experience consistent with its external positioning?",
    ac: "Is your agency's own brand as polished as the work you produce for clients?",
  }},
  { q: 16, pillar: "CULTURE", universal: true, text: "Could you describe your company culture in one sentence that every employee would agree with?" },
  { q: 17, pillar: "CULTURE", universal: false, variants: {
    bb: "Do the people closest to your business (partners, contractors, advisors) share your values?",
    bo: "Do your employees feel the company's stated values match how leadership actually behaves?",
    ia: "Does the target company's leadership team behave consistently with the company's stated values?",
    ac: "Do your employees feel the agency's stated values match how leadership actually behaves?",
  }},
  { q: 18, pillar: "CULTURE", universal: false, variants: {
    bb: "Would your best customer refer a friend without being asked?",
    bo: "Would your best employee refer a friend to work here without being asked?",
    ia: "Would the target company's best employees refer friends to work there?",
    ac: "Would your best employees refer a friend to work at your agency without being asked?",
  }},
  { q: 19, pillar: "CULTURE", universal: true, text: "Is there a documented onboarding process that immerses new hires in your brand within their first 30 days?" },
  { q: 20, pillar: "CULTURE", universal: false, variants: {
    bb: "Do you have a systematic way to capture and act on feedback from customers and collaborators?",
    bo: "Do you have a systematic way to capture and act on employee feedback?",
    ia: "Does the target company have systematic employee feedback mechanisms?",
    ac: "Do you have a systematic way to capture and act on employee feedback within your agency?",
  }},
  { q: 21, pillar: "CULTURE", universal: false, variants: {
    bb: "Are your marketing and sales efforts aligned around a single clear message?",
    bo: "Are your marketing, sales, and operations teams aligned around a single brand strategy?",
    ia: "Are the target company's departments aligned around a single brand strategy?",
    ac: "Are your agency's internal teams aligned around a single brand strategy?",
  }},
];

const specColorAt = (s: number) => SPECTRUM_COLORS[Math.min(Math.floor(s / (21 / 10)), 9)];
const exitLabel = (s: number) => {
  if (s <= 4) return "LIQUIDATION ZONE";
  if (s <= 8) return "EXIT UNLIKELY";
  if (s <= 12) return "DISRUPTION IMMINENT";
  if (s <= 15) return "MARKET VULNERABLE";
  if (s <= 18) return "EXIT POSSIBLE";
  return "EXIT READY";
};

const CASE_STUDIES = [
  { title: "From Obscurity to Global Icon in 24 Months", company: "GEEK SQUAD / BEST BUY", metric: "$3M to $1B", tag: "#1 RESIDENTIAL IT SUPPORT" },
  { title: "0% Awareness to #1 in the Country in 18 Months", company: "OVO LASIK", metric: "$0 to $15M", tag: "#1 LASIK CLINIC IN USA" },
  { title: "$3M Brand Reinvented to Become Global Leader", company: "CHIEF MANUFACTURING", metric: "$3M → $250M", tag: "#1 GLOBAL LEADER" },
];

export default function Funnel() {
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [phase, setPhase] = useState<"persona" | "quiz" | "results">("persona");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");

  const score = Object.values(answers).filter(Boolean).length;
  const totalAnswered = Object.keys(answers).length;

  const getQuestionText = (q: Question): string => {
    if (q.universal) return q.text || "";
    return q.variants?.[persona ?? "bo"] || q.variants?.bo || "";
  };

  const handleAnswer = (questionNum: number, answer: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionNum]: answer }));
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setTimeout(() => setPhase("results"), 500);
    }
  };

  const currentQuestion = QUESTIONS[currentQ];
  const pillarCounts: Record<Pillar, number> = { PERCEPTION: 0, CLARITY: 0, IDENTITY: 0, CULTURE: 0 };
  Object.entries(answers).forEach(([qNum, ans]) => {
    if (ans) {
      const q = QUESTIONS.find((q) => q.q === parseInt(qNum));
      if (q) pillarCounts[q.pillar]++;
    }
  });

  if (phase === "persona") {
    return (
      <div className="bg-[#0a0a0a] text-white font-sans min-h-screen flex flex-col items-center justify-center p-12">
        <div className="text-[10px] font-bold tracking-[4px] text-gold mb-3.5">GESTALT PARTNERS</div>
        <h1 className="text-[42px] font-extrabold text-center mb-2 -tracking-tight">FREE 21-POINT BRAND AUDIT</h1>
        <p className="text-[17px] text-muted-foreground text-center max-w-[600px] mb-10 leading-[1.75]">
          90 seconds. 21 binary questions. No gray areas. Discover what's silently eroding your exit value.
        </p>

        <div className="max-w-[400px] w-full mb-8 space-y-2">
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="COMPANY NAME" className="tracking-[0.15em] text-[11px]" />
          <div className="flex gap-2">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="FIRST NAME" className="tracking-[0.15em] text-[11px]" />
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="LAST NAME" className="tracking-[0.15em] text-[11px]" />
          </div>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" className="tracking-[0.15em] text-[11px]" />
        </div>

        <div className="text-[9px] font-bold tracking-[3px] text-muted-foreground/60 mb-3">I AM A...</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 max-w-[800px] w-full">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { setPersona(p.id); setPhase("quiz"); }}
              className="border border-white/[0.06] hover:border-white/30 px-4 py-6 text-center transition-all"
              style={{ borderColor: persona === p.id ? p.color : undefined }}
            >
              <div className="text-[10px] font-extrabold tracking-[2px] mb-1.5" style={{ color: p.color }}>{p.label}</div>
              <div className="text-[8px] text-muted-foreground leading-[1.5]">{p.sub}</div>
            </button>
          ))}
        </div>

        <div className="mt-16 max-w-[800px] w-full">
          <div className="text-[9px] font-bold tracking-[3px] text-muted-foreground/60 mb-3 text-center">GESTALT // CASE STUDIES</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.company} className="p-4 border border-[#1e1e1e] rounded-sm">
                <div className="text-[8px] font-extrabold tracking-[1.5px] text-gold mb-1">{cs.tag}</div>
                <div className="text-xs font-bold mb-1">{cs.title}</div>
                <div className="text-[9px] text-muted-foreground">{cs.company}</div>
                <div className="text-sm font-black text-gold mt-2">{cs.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="bg-[#0a0a0a] text-white font-sans min-h-screen flex flex-col">
        <div className="flex gap-0.5 px-12 pt-5 mb-2">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] transition-colors"
              style={{ background: i < totalAnswered ? "#c9a227" : i === currentQ ? "#c9a22740" : "#1e1e1e" }}
            />
          ))}
        </div>
        <div className="px-12 text-[8px] font-bold tracking-[2px] text-muted-foreground/60 mb-10">
          {currentQuestion.pillar} · QUESTION {currentQ + 1} OF 21
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-12 max-w-[700px] mx-auto">
          <div className="text-2xl font-bold text-center mb-10 leading-[1.4]">
            {getQuestionText(currentQuestion)}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAnswer(currentQuestion.q, true)}
              className="px-12 py-4 border-[#5fcc00] text-[#5fcc00] hover:bg-[#5fcc00]/10 text-xs font-extrabold tracking-[2px]"
            >YES</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAnswer(currentQuestion.q, false)}
              className="px-12 py-4 border-[#873025] text-[#873025] hover:bg-[#873025]/10 text-xs font-extrabold tracking-[2px]"
            >NO</Button>
          </div>

          {currentQ > 0 && (
            <button
              type="button"
              onClick={() => setCurrentQ(currentQ - 1)}
              className="mt-6 text-muted-foreground/60 text-[9px] tracking-[1px] hover:text-foreground"
            >
              ← PREVIOUS QUESTION
            </button>
          )}
        </div>

        <div className="px-12 py-4 border-t border-[#1e1e1e] flex justify-between text-[9px]">
          <span className="text-muted-foreground/60">SCORE: <span className="text-gold font-bold">{score} / {totalAnswered}</span></span>
          <span className="text-muted-foreground/60">{company || "YOUR COMPANY"} · {PERSONAS.find((p) => p.id === persona)?.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white font-sans min-h-screen p-12">
      <div className="max-w-[700px] mx-auto text-center">
        <div className="text-[10px] font-bold tracking-[4px] text-gold mb-3.5">FRAMEWORK COMPLETE</div>

        <div className="text-7xl font-black leading-none" style={{ color: specColorAt(score) }}>{score}</div>
        <div className="text-sm font-bold tracking-[2px] mt-1">OF 21</div>
        <div className="text-lg font-extrabold tracking-[3px] mt-3" style={{ color: specColorAt(score) }}>{exitLabel(score)}</div>

        <div className="flex h-5 rounded-[10px] overflow-hidden mt-6 mb-2">
          {SPECTRUM_COLORS.map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-6">
          {(Object.entries(pillarCounts) as [Pillar, number][]).map(([pillar, count]) => {
            const max = pillar === "CULTURE" ? 6 : 5;
            const color = count >= max * 0.7 ? "#5fcc00" : count >= max * 0.4 ? "#c9a227" : "#873025";
            return (
              <div key={pillar} className="p-3 border border-[#1e1e1e] rounded-sm">
                <div className="text-[7px] font-bold tracking-[1.5px] text-muted-foreground/60">{pillar}</div>
                <div className="text-xl font-black" style={{ color }}>{count}/{max}</div>
              </div>
            );
          })}
        </div>

        <div className="text-left mt-8">
          <div className="text-[9px] font-bold tracking-[2px] text-gold mb-3">YOUR BLINDSPOTS</div>
          {QUESTIONS.filter((q) => answers[q.q] === false).map((q) => (
            <div key={q.q} className="px-3.5 py-2.5 border-l-[3px] border-[#873025] bg-[#0f0808] mb-1.5 rounded-sm">
              <div className="text-[7px] font-bold tracking-[1px] text-[#873025] mb-0.5">{q.pillar} · Q{q.q}</div>
              <div className="text-[9px] text-muted-foreground">{getQuestionText(q)}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 px-8 py-6 border border-gold bg-gold/[0.03] rounded-sm">
          <div className="text-lg font-extrabold mb-2">READY TO CLOSE THESE GAPS?</div>
          <div className="text-[10px] text-muted-foreground mb-4">
            FOCUS gives you 100 deeper questions, dollar-valued blindspots, and GESTALT INTELLIGENCE recommendations personalized to {company || "your business"}.
          </div>
          <Button className="px-11 py-4 bg-gold text-black hover:bg-gold/90 text-[10px] font-extrabold tracking-[2.5px]">
            UNLOCK FULL INTELLIGENCE →
          </Button>
        </div>
      </div>
    </div>
  );
}
