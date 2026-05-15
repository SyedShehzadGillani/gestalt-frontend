export type VaultModule =
  | "FORMULA"
  | "FRAMEWORK"
  | "FOCUS"
  | "HIVE"
  | "SUM"
  | "FINANCIALS"
  | "CERTIFIED";

export type VaultStatus = "archived" | "draft" | "live_copy";

export interface VaultAiProvenance {
  model_version: string;
  confidence: number;
  citations_count: number;
  user_modified_sections?: string[];
}

export interface VaultDocument {
  id: string;
  company_id: string;
  company_name: string;
  module: VaultModule;
  section: string;
  section_code: string;
  version: number;
  status: VaultStatus;
  signed_off_by: string | null;
  signed_off_at: string | null;
  data: Record<string, unknown>;
  ai_provenance?: VaultAiProvenance;
  pdf_url?: string;
  parent_id?: string | null;
  created_at: string;
}

export interface VaultCategory {
  id: string;
  parent_id: string | null;
  name: string;
  path: string;
  section_code: string | null;
  sort_order: number;
}
