export type MoodImage = { id: number; height: number; desc: string };
export type MoodBoard = { id: number; name: string; images: MoodImage[] };

export const INITIAL_BOARDS: MoodBoard[] = [
  {
    id: 1,
    name: "BRAND ATMOSPHERE",
    images: [
      { id: 1, height: 200, desc: "Warm gold tones in natural light. Communicates trust, premium quality, and timelessness." },
      { id: 2, height: 280, desc: "Dark editorial workspace. Communicates focus, professionalism, and strategic depth." },
      { id: 3, height: 160, desc: "Textured metal surface with patina. Communicates craftsmanship, heritage, and durability." },
      { id: 4, height: 240, desc: "Architectural detail with sharp geometry. Communicates precision, structure, and confidence." },
      { id: 5, height: 180, desc: "Human hands working at a desk. Communicates dedication, expertise, and personal touch." },
      { id: 6, height: 260, desc: "City skyline at golden hour. Communicates ambition, scale, and the promise of growth." },
      { id: 7, height: 150, desc: "Minimal typography on dark background. Communicates clarity, authority, and modern sophistication." },
      { id: 8, height: 220, desc: "Close-up of quality materials. Communicates attention to detail and uncompromising standards." },
    ],
  },
  {
    id: 2,
    name: "COMPETITIVE LANDSCAPE",
    images: [
      { id: 1, height: 220, desc: "Generic corporate blue. What our competitors look like. We avoid this." },
      { id: 2, height: 180, desc: "Cluttered dashboard UI. Communicates complexity. We communicate clarity." },
      { id: 3, height: 240, desc: "Stock photo handshake. Communicates nothing. We use authentic imagery." },
      { id: 4, height: 160, desc: "Overly polished lifestyle. Communicates inauthenticity. We show real work." },
    ],
  },
];
