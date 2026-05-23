import jsPDF from "jspdf";
import type { OnboardingQuestion, Demographic } from "./onboarding-data";
import { pickForDemo } from "./onboarding-data";
import type { Answer } from "./results-logic";
import { yesCount, brandHealth, bandFor, blindspotIndices } from "./results-logic";

export function downloadResultsPdf(opts: {
  module: "FRAMEWORK" | "FOCUS";
  companyName: string;
  questions: OnboardingQuestion[];
  answers: Answer[];
  demographic: Demographic;
  confidence: number;
}) {
  const { module, companyName, questions, answers, demographic, confidence } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const yes = yesCount(answers);
  const total = questions.length;
  const health = brandHealth(answers);
  let y = 56;

  doc.setFontSize(20);
  doc.text(`GESTALT ${module} RESULTS`, 40, y); y += 24;
  doc.setFontSize(11);
  doc.text(`${companyName}`, 40, y); y += 16;
  doc.text(`Score: ${yes} of ${total} points  ·  Brand Health ${health}/100  ·  ${bandFor(health).label}`, 40, y); y += 14;
  doc.text(`Self-rated confidence: ${confidence}/10`, 40, y); y += 26;

  doc.setFontSize(14);
  const blindspots = blindspotIndices(answers);
  doc.text(`Identified Blindspots (${blindspots.length})`, 40, y); y += 18;
  doc.setFontSize(10);

  blindspots.forEach((i) => {
    const q = questions[i];
    const text = pickForDemo(q.text, demographic);
    const lines = doc.splitTextToSize(`${q.pillar}: ${text}`, 515) as string[];
    if (y > 760) { doc.addPage(); y = 56; }
    doc.text(lines, 40, y); y += lines.length * 13 + 4;
    doc.setTextColor(120);
    doc.text(`Solution: ${q.blindspot.gestaltSolution} · ${q.blindspot.timeline} · Priority ${q.blindspot.priority}`, 48, y);
    doc.setTextColor(0); y += 18;
  });

  doc.save(`${companyName.replace(/\s+/g, "-")}-${module}-results.pdf`);
}
