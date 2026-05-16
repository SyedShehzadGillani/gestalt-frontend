// Spec + v12 mockup: 8 Messaging cards + cascading pitch tiers.
export type MessagingBlock = { id: string; title: string; desc: string };

export const MESSAGING_BLOCKS: MessagingBlock[] = [
  { id: "boilerplate", title: "BOILERPLATE COPY", desc: "Standard company description. 100-150 words." },
  { id: "voice", title: "VOICE & TONE", desc: "Voice is personality. Tone shifts by context." },
  { id: "use", title: "WORDS TO USE", desc: "Preferred vocabulary." },
  { id: "avoid", title: "WORDS TO AVOID", desc: "Language that contradicts positioning." },
  { id: "headlines", title: "SAMPLE HEADLINES", desc: "Templates demonstrating voice." },
  { id: "ctas", title: "SAMPLE CTAs", desc: "CTA language for web, email, social." },
  { id: "social", title: "SOCIAL MEDIA CAPTIONS", desc: "Per-platform guidance." },
  { id: "email", title: "EMAIL & PROPOSAL", desc: "Templates for outreach." },
];

export type PitchTier = { key: string; seconds: string; label: string; example: string; size: number };

export const PITCH_TIERS: PitchTier[] = [
  { key: "pitch_3", seconds: "3", label: "HOOK", example: "Visual Wikipedia of Sports.", size: 36 },
  { key: "pitch_7", seconds: "7", label: "CONTEXT", example: "We can find media within event instantly with 99.1% accuracy — Google can't.", size: 28 },
  { key: "pitch_15", seconds: "15", label: "VISION", example: "We automatically organize sports media to the exact moment — making millions of hours instantly searchable and shoppable. Google can't.", size: 22 },
];
