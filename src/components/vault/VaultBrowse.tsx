import { useMemo, useState } from "react";
import { VAULT_CATEGORIES } from "@/data/vault-categories";
import { getAllVaultDocuments } from "@/data/vault-mock";
import type { VaultDocument } from "@/data/vault-types";
import { VaultCategoryTree } from "./VaultCategoryTree";
import { VaultDocumentList } from "./VaultDocumentList";
import { VaultSearch } from "./VaultSearch";
import "./vault.css";

interface Props {
  basePath: string;
}

function matchesPath(doc: VaultDocument, path: string | null): boolean {
  if (!path) return true;
  const cat = VAULT_CATEGORIES.find((c) => c.section_code === doc.section_code);
  if (!cat) return false;
  return cat.path === path || cat.path.startsWith(`${path} / `);
}

function matchesQuery(doc: VaultDocument, q: string): boolean {
  if (!q.trim()) return true;
  const hay = [
    doc.company_name,
    doc.module,
    doc.section,
    doc.section_code,
    doc.signed_off_by ?? "",
    JSON.stringify(doc.data),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function VaultBrowse({ basePath }: Props) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const allDocs = useMemo(() => getAllVaultDocuments(), []);
  const filtered = useMemo(
    () => allDocs.filter((d) => matchesPath(d, selectedPath) && matchesQuery(d, query)),
    [allDocs, selectedPath, query],
  );

  return (
    <div className="vault-scope p-6">
      <header className="mb-4">
        <h1 className="text-[24px] font-semibold text-foreground mb-1">VAULT</h1>
        <p className="text-[13px] text-foreground-secondary">
          Institutional memory — every sign-off archived, versioned, and searchable.
        </p>
      </header>

      <div className="vault-layout">
        <VaultCategoryTree
          documents={allDocs}
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
        />
        <div className="vault-main">
          <VaultSearch value={query} onChange={setQuery} />
          {selectedPath && (
            <div className="vault-category-path mb-2">{selectedPath}</div>
          )}
          <VaultDocumentList
            documents={filtered}
            showCategoryPath={!selectedPath || Boolean(query)}
            basePath={basePath}
          />
        </div>
      </div>
    </div>
  );
}
