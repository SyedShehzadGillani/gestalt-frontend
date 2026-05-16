// Spec §3 + v12 mockup: 11 Brand Foundation cards.
export type FoundationBlock = { id: string; title: string; desc: string };

export const FOUNDATION_BLOCKS: FoundationBlock[] = [
  { id: "overview", title: "BRAND OVERVIEW", desc: "A concise summary of who the company is, what it does, who it serves, and what makes it different." },
  { id: "mission", title: "MISSION", desc: "Why the company exists beyond making money. The daily purpose that guides every decision." },
  { id: "vision", title: "VISION", desc: "The future state the company is building toward. Where the mission is present-tense, the vision is aspirational." },
  { id: "values", title: "CORE VALUES", desc: "The non-negotiable principles that guide every decision, hire, and partnership. If a value doesn't influence who gets fired, it's not real." },
  { id: "promise", title: "BRAND PROMISE", desc: "The single most important commitment the company makes to its customers. Every interaction should deliver on this." },
  { id: "positioning", title: "POSITIONING STATEMENT", desc: "How the brand occupies a distinct place in the audience's mind. Defines what you are AND what you are not." },
  { id: "audience", title: "AUDIENCE PROFILES", desc: "Primary, secondary, and tertiary audiences. Demographics, psychographics, pain points, and aspirations." },
  { id: "differentiators", title: "DIFFERENTIATORS", desc: "3-5 defensible things competitors cannot replicate. Must be provable with evidence." },
  { id: "competitive", title: "COMPETITIVE CONTEXT", desc: "Where the brand sits in the competitive landscape. Who competes, where they fall short, how this brand wins." },
  { id: "personality", title: "BRAND PERSONALITY", desc: "If the brand were a person, how would they speak, dress, and behave? Guides tone, style, and interaction." },
  { id: "story", title: "BRAND STORY", desc: "Origin, struggle, breakthrough, mission. Tellable in 60 seconds, memorable after one hearing." },
];
