import { ECard } from "./ECard";
import { GOVERNANCE_CARDS } from "./data/section-data";

export function GovernanceSection() {
  return (
    <div className="vb-grid-3">
      {GOVERNANCE_CARDS.map((g) => (
        <ECard key={g.t} title={g.t} desc={g.d} />
      ))}
    </div>
  );
}
