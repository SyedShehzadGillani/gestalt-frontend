import { ECard } from "./ECard";
import { FOUNDATION_BLOCKS } from "./data/foundation-blocks";

export function BrandFoundationSection() {
  return (
    <>
      {FOUNDATION_BLOCKS.map((b) => (
        <ECard key={b.id} title={b.title} desc={b.desc} />
      ))}
    </>
  );
}
