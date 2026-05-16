// VAULT Brand Assets — section nav. Order matches spec §3.1.
export type VaultSection = { id: string; label: string; defaultClosed?: boolean };

export const VAULT_SECTIONS: VaultSection[] = [
  { id: "dashboard", label: "DASHBOARD" },
  { id: "toc", label: "TABLE OF CONTENTS", defaultClosed: true },
  { id: "foundation", label: "BRAND FOUNDATION" },
  { id: "messaging", label: "MESSAGING" },
  { id: "identity", label: "VISUAL IDENTITY" },
  { id: "usage", label: "USAGE RULES" },
  { id: "color", label: "COLOR SYSTEM" },
  { id: "typography", label: "TYPOGRAPHY" },
  { id: "graphics", label: "GRAPHICS" },
  { id: "photography", label: "PHOTOGRAPHY" },
  { id: "video", label: "VIDEO LIBRARY" },
  { id: "motion", label: "MOTION" },
  { id: "applications", label: "APPLICATIONS" },
  { id: "digital", label: "DIGITAL BRAND" },
  { id: "governance", label: "GOVERNANCE" },
  { id: "naming", label: "FILE NAMING" },
  { id: "formats", label: "FORMATS" },
  { id: "folders", label: "FOLDERS" },
  { id: "index", label: "ASSET INDEX" },
  { id: "readme", label: "READ ME" },
  { id: "checklist", label: "CHECKLIST" },
];
