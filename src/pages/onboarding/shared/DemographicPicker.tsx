import { DEMOGRAPHICS, type Demographic } from "./onboarding-data";

export function DemographicPicker({ onPick }: { onPick: (d: Demographic) => void }) {
  return (
    <div className="ob-demo">
      <div className="ob-label">GESTALT INTELLIGENCE</div>
      <h1 className="ob-demo-h1">Who are you building this for?</h1>
      <p className="ob-demo-sub">Your answers are tailored to your role. Pick the closest fit.</p>
      <div className="ob-demo-cards">
        {DEMOGRAPHICS.map((d) => (
          <button key={d.id} className="ob-demo-card" onClick={() => onPick(d.id)}>
            <div className="ob-demo-tag">{d.tag}</div>
            <div className="ob-demo-title">{d.title}</div>
            <p className="ob-demo-desc">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
