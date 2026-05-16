import { ECard } from "./ECard";
import { FORMAT_CARDS } from "./data/section-data";

export function FormatsSection() {
  return (
    <div className="vb-grid-4">
      {FORMAT_CARDS.map((f) => (
        <ECard key={f.t} title={f.t} desc={f.d} />
      ))}
    </div>
  );
}
