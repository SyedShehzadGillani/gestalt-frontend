import type { OnboardingQuestion } from "./onboarding-data";

// Red blindspot panel. Renders inline after a NO answer (per PDF p.7 layout).

export function BlindspotPanel({ question, onContinue }: { question: OnboardingQuestion; onContinue: () => void }) {
  const b = question.blindspot;
  return (
    <div className="ob-blindspot">
      <div className="ob-blindspot-q">
        <div className="ob-blindspot-label">BLINDSPOT EXPOSED</div>
        <div className="ob-blindspot-text">{question.text}</div>
        <div className="ob-blindspot-answer">NO.</div>
      </div>
      <p className="ob-blindspot-implication">{b.implication}</p>
      {question.citations[0] && (
        <p className="ob-blindspot-stat">
          <span className="ob-blindspot-stat-lead">"{question.citations[0].highlight}</span> {question.citations[0].text}<span className="ob-blindspot-stat-lead">"</span>
          <br /><span className="ob-blindspot-source">-{question.citations[0].source}</span>
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
