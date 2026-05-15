import type { VaultDocument } from "./vault-types";

const NORTHGATE_ID = "northgate-solutions";
const NORTHGATE_NAME = "Northgate Solutions";

export const VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: "vd-01-10-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FORMULA",
    section: "Competitive Landscape",
    section_code: "01.10",
    version: 1,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-05-10T14:47:00Z",
    created_at: "2026-05-10T14:47:00Z",
    pdf_url: "r2://vault/northgate-solutions/formula/competitive-landscape/2026-05-10-v1.pdf",
    ai_provenance: {
      model_version: "claude-opus-4-7",
      confidence: 88,
      citations_count: 31,
      user_modified_sections: ["s02"],
    },
    data: {
      word_exercise: {
        selected_words: ["PREMIUM", "TECHNOLOGY", "COMMUNITY", "BRAND RECOGNITION", "TRUSTED", "DESIGN"],
        priority_6: ["PREMIUM", "TECHNOLOGY", "COMMUNITY", "BRAND RECOGNITION", "TRUSTED", "DESIGN"],
        manifesto_text:
          "Northgate Solutions delivers premium, technology-led service grounded in community trust and design excellence.",
        manifesto_version: 2,
      },
      competitors: {
        known: [
          { name: "OVO LASIK + LENS", color: "#58d3ff", narrative: "Aggressive on price, weak on community." },
          { name: "Whiting Clinic", color: "#e3398c", narrative: "Strong legacy brand, slow technology adoption." },
          { name: "LasikPlus", color: "#ff6b35", narrative: "National scale, generic positioning." },
        ],
        surfaced: [
          { name: "TCEC", color: "#8bc34a", threat: 44, evidence: "Rapid local growth in last 6 months." },
          { name: "MN Eye", color: "#7c3aed", threat: 40, evidence: "Investing in patient-experience tech." },
        ],
      },
      spectrum_placements: {
        innovation: { OVO: 72, Whiting: 35, LasikPlus: 55, TODAY: 35, VISION: 72 },
        customer_experience: { OVO: 68, Whiting: 55, LasikPlus: 60, TODAY: 30, VISION: 78 },
      },
    },
  },
  {
    id: "vd-01-10-v2",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FORMULA",
    section: "Competitive Landscape",
    section_code: "01.10",
    version: 2,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-05-14T14:47:00Z",
    created_at: "2026-05-14T14:47:00Z",
    parent_id: "vd-01-10-v1",
    pdf_url: "r2://vault/northgate-solutions/formula/competitive-landscape/2026-05-14-v2.pdf",
    ai_provenance: {
      model_version: "claude-opus-4-7",
      confidence: 91,
      citations_count: 35,
      user_modified_sections: ["s02", "s08"],
    },
    data: {
      word_exercise: {
        selected_words: ["PREMIUM", "TECHNOLOGY", "COMMUNITY", "BRAND RECOGNITION", "TRUSTED", "DESIGN"],
        priority_6: ["PREMIUM", "TECHNOLOGY", "COMMUNITY", "BRAND RECOGNITION", "TRUSTED", "DESIGN"],
        manifesto_text:
          "Northgate Solutions sets the local standard for premium, technology-led service — anchored in community trust and design excellence.",
        manifesto_version: 3,
      },
      competitors: {
        known: [
          { name: "OVO LASIK + LENS", color: "#58d3ff", narrative: "Aggressive on price, weak on community." },
          { name: "Whiting Clinic", color: "#e3398c", narrative: "Strong legacy brand, slow technology adoption." },
          { name: "LasikPlus", color: "#ff6b35", narrative: "National scale, generic positioning." },
        ],
        surfaced: [
          { name: "TCEC", color: "#8bc34a", threat: 44, evidence: "Rapid local growth in last 6 months." },
          { name: "MN Eye", color: "#7c3aed", threat: 40, evidence: "Investing in patient-experience tech." },
        ],
      },
      spectrum_placements: {
        innovation: { OVO: 72, Whiting: 35, LasikPlus: 55, TODAY: 38, VISION: 75 },
        customer_experience: { OVO: 68, Whiting: 55, LasikPlus: 60, TODAY: 34, VISION: 80 },
      },
    },
  },
  {
    id: "vd-01-20-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FORMULA",
    section: "Business Objectives",
    section_code: "01.20",
    version: 1,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-05-12T11:20:00Z",
    created_at: "2026-05-12T11:20:00Z",
    data: {
      objectives: [
        "Grow ARR 35% YoY",
        "Lift NPS from 41 to 55",
        "Open second clinic location by Q3 2026",
      ],
    },
  },
  {
    id: "vd-02-10-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FOCUS",
    section: "Target Audiences",
    section_code: "02.10",
    version: 1,
    status: "archived",
    signed_off_by: "Priya Patel",
    signed_off_at: "2026-04-22T09:05:00Z",
    created_at: "2026-04-22T09:05:00Z",
    ai_provenance: { model_version: "claude-opus-4-7", confidence: 86, citations_count: 22 },
    data: {
      personas: [
        { name: "Premium Professional", age: "35-55", income: "$120k+" },
        { name: "Active Retiree", age: "60-72", income: "$80k+" },
      ],
    },
  },
  {
    id: "vd-frmk-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FRAMEWORK",
    section: "21pt Assessment",
    section_code: "FRMK",
    version: 1,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-04-19T16:30:00Z",
    created_at: "2026-04-19T16:30:00Z",
    data: { score: 72, brand: 24, strategy: 22, engine: 26 },
  },
  {
    id: "vd-hive-q2-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "HIVE",
    section: "Q2 2026 Assessment",
    section_code: "HIVE",
    version: 1,
    status: "archived",
    signed_off_by: "Marcus Williams",
    signed_off_at: "2026-06-30T17:00:00Z",
    created_at: "2026-06-30T17:00:00Z",
    data: { personal: 78, customer: 71, staff: 69, knowledge: 74, overall: 73 },
  },
  {
    id: "vd-sumj-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "SUM",
    section: "Journal",
    section_code: "SUMJ",
    version: 1,
    status: "archived",
    signed_off_by: "Sarah Chen",
    signed_off_at: "2026-05-08T08:15:00Z",
    created_at: "2026-05-08T08:15:00Z",
    data: { entries_count: 42, depth_score: 7.8 },
  },
  {
    id: "vd-finx-q1-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "FINANCIALS",
    section: "Q1 2026 Close",
    section_code: "FINX",
    version: 1,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-04-05T12:00:00Z",
    created_at: "2026-04-05T12:00:00Z",
    data: { revenue: 2_840_000, ebitda: 612_000, margin: 0.215 },
  },
  {
    id: "vd-cert-v1",
    company_id: NORTHGATE_ID,
    company_name: NORTHGATE_NAME,
    module: "CERTIFIED",
    section: "Exit Score Certification",
    section_code: "CERT",
    version: 1,
    status: "archived",
    signed_off_by: "Alex Chen",
    signed_off_at: "2026-05-01T15:45:00Z",
    created_at: "2026-05-01T15:45:00Z",
    ai_provenance: { model_version: "claude-opus-4-7", confidence: 94, citations_count: 48 },
    data: { exit_score: 78, multiple_range: [5.2, 6.8], certification_id: "CERT-2026-0142" },
  },
];

export function getVaultDocumentById(id: string): VaultDocument | undefined {
  return VAULT_DOCUMENTS.find((d) => d.id === id);
}

export function getVaultDocumentsBySectionCode(code: string): VaultDocument[] {
  return VAULT_DOCUMENTS.filter((d) => d.section_code === code).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getAllVaultDocuments(): VaultDocument[] {
  return [...VAULT_DOCUMENTS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
