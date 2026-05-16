import { ECard } from "./ECard";
import { README_FAQS } from "./data/section-data";

export function ReadMeSection() {
  return (
    <div className="vb-grid-2">
      {README_FAQS.map((faq) => (
        <ECard key={faq.t} title={faq.t} saved={faq.d} />
      ))}
    </div>
  );
}
