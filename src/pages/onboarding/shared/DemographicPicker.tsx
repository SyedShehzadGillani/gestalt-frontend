import brandAuditHero from "@/assets/brand-audit-hero.png";
import { DEMOGRAPHICS, type Demographic } from "./onboarding-data";

export function DemographicPicker({ onPick }: { onPick: (d: Demographic) => void }) {
  return (
    <div className="ob-hero">
      <div className="ob-label">GESTALT INTELLIGENCE</div>

      <h1 className="ob-hero-headline">
        <span className="w">30 YEARS</span><span className="g">.</span>{" "}
        <span className="g">HUNDREDS OF TRANSFORMATIONS</span><span className="g">.</span>
        <br />
        <span className="w">EVERY INDUSTRY</span><span className="g">.</span>{" "}
        <span className="gr">ONE SYSTEM</span><span className="g">.</span>
      </h1>

      <div className="ob-hero-img">
        <img src={brandAuditHero} alt="" />
      </div>

      <h2 className="ob-hero-q">Who are you building this for?</h2>
      <p className="ob-hero-offer">
        <span className="w">FREE</span>{" "}
        <span className="g">CUSTOMIZED 21PT ASSESSMENT</span>{" "}
        <span className="w">+</span>{" "}
        <span className="g">BLINDSPOT INSIGHT!</span>
      </p>

      <p className="ob-hero-choose">
        <span className="gr">YOUR ANSWERS ARE TAILORED TO YOUR ROLE.</span>{" "}
        <span className="w">CHOOSE ONE!</span>
      </p>

      <div className="ob-demo-cards">
        {DEMOGRAPHICS.map((d) => (
          <button
            key={d.id}
            className="ob-demo-card"
            data-color={d.color}
            onClick={() => onPick(d.id)}
          >
            <div className="ob-demo-tag">{d.tag}</div>
            <div className="ob-demo-title">{d.title}</div>
            <p className="ob-demo-desc">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
