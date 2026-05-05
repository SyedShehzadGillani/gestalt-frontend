import type { PanelMessage } from "@/components/formula/FormulaPanel";

export type TriggerAi = (msg: PanelMessage) => void;
export type SignOffSection = (sectionId: string) => void;
