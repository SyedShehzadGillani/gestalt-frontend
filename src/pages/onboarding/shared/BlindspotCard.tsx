import type { OnboardingQuestion, Demographic } from "./onboarding-data";
import { pickForDemo } from "./onboarding-data";

// One blindspot, rendered as a list item on the results dashboard.
// `index` is the 0-based position in the module; displayed 1-based as NN / PILLAR.
export function BlindspotCard({
  question,
  demographic,
  index,
}: {
  question: OnboardingQuestion;
  demographic: Demographic;
  index: number;
}) {
  const b = question.blindspot;
  const text = pickForDemo(question.text, demographic);
  const leadStat = pickForDemo(question.noStats, demographic)[0];
  return (
    <div className="ob-bs-card">
      <div className="ob-bs-card-head">
        {String(index + 1).padStart(2, "0")} / <span>{question.pillar}</span>
      </div>
      <div className="ob-bs-card-q">{text} <span className="ob-bs-card-no">NO.</span></div>
      <p className="ob-bs-card-impl">{b.implication}</p>
      {leadStat && (
        <p className="ob-bs-card-stat">
          "<strong>{leadStat.highlight}</strong> {leadStat.text}"
          <br /><span className="ob-bs-card-src">-{leadStat.source}</span>
        </p>
      )}
      <div className="ob-bs-card-solution">GESTALT SOLUTION: {b.gestaltSolution}</div>
      <div className="ob-bs-card-meta">
        <span>Timeline: <strong>{b.timeline}</strong></span>
        <span>Priority: <strong className={`pr-${b.priority.toLowerCase()}`}>{b.priority}</strong></span>
        <span>Impact: <strong className={`im-${b.impact.toLowerCase()}`}>{b.impact}</strong></span>
      </div>
    </div>
  );
}
