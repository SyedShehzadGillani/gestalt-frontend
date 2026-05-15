import type { VaultCategory } from "./vault-types";

export const VAULT_CATEGORIES: VaultCategory[] = [
  { id: "base", parent_id: null, name: "B.A.S.E.", path: "B.A.S.E.", section_code: null, sort_order: 1 },

  { id: "base-formula", parent_id: "base", name: "FORMULA", path: "B.A.S.E. / FORMULA", section_code: null, sort_order: 1 },
  { id: "base-formula-01-10", parent_id: "base-formula", name: "Competitive Landscape", path: "B.A.S.E. / FORMULA / Competitive Landscape", section_code: "01.10", sort_order: 1 },
  { id: "base-formula-01-20", parent_id: "base-formula", name: "Business Objectives", path: "B.A.S.E. / FORMULA / Business Objectives", section_code: "01.20", sort_order: 2 },
  { id: "base-formula-01-30", parent_id: "base-formula", name: "Barriers & Challenges", path: "B.A.S.E. / FORMULA / Barriers & Challenges", section_code: "01.30", sort_order: 3 },
  { id: "base-formula-04-10", parent_id: "base-formula", name: "Launch Action Plan", path: "B.A.S.E. / FORMULA / Launch Action Plan", section_code: "04.10", sort_order: 4 },

  { id: "base-focus", parent_id: "base", name: "FOCUS", path: "B.A.S.E. / FOCUS", section_code: null, sort_order: 2 },
  { id: "base-focus-02-10", parent_id: "base-focus", name: "Target Audiences", path: "B.A.S.E. / FOCUS / Target Audiences", section_code: "02.10", sort_order: 1 },
  { id: "base-focus-02-20", parent_id: "base-focus", name: "Customer Experience", path: "B.A.S.E. / FOCUS / Customer Experience", section_code: "02.20", sort_order: 2 },
  { id: "base-focus-02-30", parent_id: "base-focus", name: "Brand Architecture", path: "B.A.S.E. / FOCUS / Brand Architecture", section_code: "02.30", sort_order: 3 },
  { id: "base-focus-03-10", parent_id: "base-focus", name: "Campaign Outlets", path: "B.A.S.E. / FOCUS / Campaign Outlets", section_code: "03.10", sort_order: 4 },
  { id: "base-focus-03-20", parent_id: "base-focus", name: "Campaign Options", path: "B.A.S.E. / FOCUS / Campaign Options", section_code: "03.20", sort_order: 5 },
  { id: "base-focus-03-30", parent_id: "base-focus", name: "Success Measures", path: "B.A.S.E. / FOCUS / Success Measures", section_code: "03.30", sort_order: 6 },

  { id: "base-framework", parent_id: "base", name: "FRAMEWORK", path: "B.A.S.E. / FRAMEWORK", section_code: "FRMK", sort_order: 3 },
  { id: "base-financials", parent_id: "base", name: "FINANCIALS", path: "B.A.S.E. / FINANCIALS", section_code: "FINX", sort_order: 4 },

  { id: "hive", parent_id: null, name: "H.I.V.E.", path: "H.I.V.E.", section_code: null, sort_order: 2 },
  { id: "hive-assess", parent_id: "hive", name: "Assessments", path: "H.I.V.E. / Assessments", section_code: "HIVE", sort_order: 1 },

  { id: "sum", parent_id: null, name: "S.U.M.", path: "S.U.M.", section_code: null, sort_order: 3 },
  { id: "sum-journal", parent_id: "sum", name: "Journal", path: "S.U.M. / Journal", section_code: "SUMJ", sort_order: 1 },

  { id: "certified", parent_id: null, name: "CERTIFIED", path: "CERTIFIED", section_code: null, sort_order: 4 },
  { id: "certified-qual", parent_id: "certified", name: "Qualification Records", path: "CERTIFIED / Qualification Records", section_code: "CERT", sort_order: 1 },
];
