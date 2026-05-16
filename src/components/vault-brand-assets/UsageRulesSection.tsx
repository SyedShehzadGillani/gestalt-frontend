import { ECard } from "./ECard";
import { USAGE_RULES } from "./data/section-data";

export function UsageRulesSection() {
  return (
    <div className="vb-grid-2">
      {USAGE_RULES.map((r) => (
        <ECard key={r.t} title={r.t} desc={r.d} />
      ))}
    </div>
  );
}
