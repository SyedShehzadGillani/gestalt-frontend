export type ECardVersionSource = "manual" | "FORMULA" | string;

export type ECardVersion = {
  id: number;
  text: string;
  date: string;
  label: string;
  source: ECardVersionSource;
};

export const TODAY = "2026-05-16";
