import { ECard } from "./ECard";
import { CascadingPitch } from "./CascadingPitch";
import { MESSAGING_BLOCKS } from "./data/messaging-blocks";

export function MessagingSection() {
  return (
    <>
      <ECard title="TAGLINE" desc="The short phrase that captures brand essence in under 10 words." />
      <CascadingPitch />
      {MESSAGING_BLOCKS.map((b) => (
        <ECard key={b.id} title={b.title} desc={b.desc} />
      ))}
    </>
  );
}
