// Position Builder Types

export interface CoreValue {
  id: string;
  word: string;
  definition: string;
  expectation: string;
}

export interface QuadrantCriteria {
  id: string;
  label: string;
  definition: string; // AI-generated or manually edited definition
  expectation: string; // AI-generated or manually edited expectation
  score: number; // 1-5
  color: "white" | "yellow" | "orange" | "blue";
}

export interface Quadrant {
  id: "PERSONAL" | "PATIENT" | "STAFF" | "KNOWLEDGE";
  title: string;
  criteria: QuadrantCriteria[];
  color: string;
}

export interface Position {
  id: string;
  name: string;
  coreValue: CoreValue | null;
  quadrants: Record<Quadrant["id"], Quadrant>;
}

export interface PositionBuilderState {
  positions: Position[];
  activePositionId: string | null;
  activeQuadrantId: Quadrant["id"] | null;
  availableTags: string[];
}

// Suggestion tags for AI to provide
export const DEFAULT_SUGGESTION_TAGS = [
  "ATTENTIVE", "LATE", "SHARING", "HELPFUL", "EMPATHETIC", "SCORE", "TECHNICAL", "PROBLEM SOLVER", "PREPARED",
  "FORMALITY", "FIRM", "RELIABLE", "TRUST", "HYGIENE", "DETAILED", "TIMING", "POST",
  "TRUST", "ABILITY", "LOBBY", "GREETING", "ATTENTIVE", "SHARING", "GREETING", "ON-TIME", "APPLY",
  "CONSIDER", "TEAMMATE", "CENTERED", "ACHIEVE", "STRONG", "PREP", "POST", "MASTERY"
];

// Quadrant color mapping
export const QUADRANT_COLORS: Record<Quadrant["id"], { bg: string; text: string; border: string; hex: string }> = {
  PERSONAL: { bg: "bg-white/10", text: "text-white", border: "border-white/30", hex: "#FFFFFF" },
  PATIENT: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/50", hex: "#FF8C00" },
  STAFF: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50", hex: "#FFD700" },
  KNOWLEDGE: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/50", hex: "#4169E1" },
};

// Default positions for healthcare
export const DEFAULT_POSITIONS: string[] = [
  "TECH 1", "TECH 2", "RECEPTIONIST", "OD", "SURGEON", "CALL CENTER", "MANAGER"
];

export function createEmptyPosition(name: string): Position {
  return {
    id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    coreValue: null,
    quadrants: {
      PERSONAL: { id: "PERSONAL", title: "Personal", criteria: [], color: "#FFFFFF" },
      PATIENT: { id: "PATIENT", title: "Patient", criteria: [], color: "#FF8C00" },
      STAFF: { id: "STAFF", title: "Staff", criteria: [], color: "#FFD700" },
      KNOWLEDGE: { id: "KNOWLEDGE", title: "Knowledge", criteria: [], color: "#4169E1" },
    },
  };
}
