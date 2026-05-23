import type { OnboardingQuestion, Demographic } from "./onboarding-data";
import { pickForDemo } from "./onboarding-data";

// Red blindspot panel. Renders inline after a NO answer (per PDF p.7 layout).
// Uses the NO-path stats for the active demographic — these are the
// fear/cost-of-inaction stats designed to surface urgency.

export function BlindspotPanel({
  question,
  demographic,
  onContinue,
}: {
  question: OnboardingQuestion;
  demographic: Demographic;
  onContinue: () => void;
}) {
  const b = question.blindspot;
  const text = pickForDemo(question.text, demographic);
  const stats = pickForDemo(question.noStats, demographic);
  const leadStat = stats[0];

  return (
    <div className="ob-blindspot">
      <div className="ob-blindspot-q">
        <div className="ob-blindspot-label">BLINDSPOT EXPOSED</div>
        <div className="ob-blindspot-text">{text}</div>
        <div className="ob-blindspot-answer">NO.</div>
      </div>
      <p className="ob-blindspot-implication">{b.implication}</p>
      {leadStat && (
        <p className="ob-blindspot-stat">
          <span className="ob-blindspot-stat-lead">"{leadStat.highlight}</span> {leadStat.text}<span className="ob-blindspot-stat-lead">"</span>
          <br /><span className="ob-blindspot-source">-{leadStat.source}</span>
        </p>
      )}
      <div className="ob-blindspot-solution">
        <span className="ob-blindspot-solution-label">GESTALT SOLUTION:</span>{" "}
        <span className="ob-blindspot-solution-name">{b.gestaltSolution}</span>
      </div>
      <div className="ob-blindspot-meta">
        <span>Timeline: <strong>{b.timeline}</strong></span>
        <span>Priority: <strong>{b.priority}</strong></span>
        <span>Impact: <strong>{b.impact}</strong></span>
      </div>
      <button className="ob-blindspot-continue" onClick={onContinue}>CONTINUE →</button>
    </div>
  );
}
