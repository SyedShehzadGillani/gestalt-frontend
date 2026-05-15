import { useNavigate, useParams } from "react-router-dom";
import { VAULT_CATEGORIES } from "@/data/vault-categories";
import type { VaultDocument } from "@/data/vault-types";
import { VaultStatusBadge } from "./VaultStatusBadge";

interface Props {
  documents: VaultDocument[];
  showCategoryPath?: boolean;
  basePath: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildTitle(doc: VaultDocument): string {
  const date = doc.signed_off_at
    ? new Date(doc.signed_off_at).toISOString().slice(0, 10)
    : new Date(doc.created_at).toISOString().slice(0, 10);
  return `${doc.company_name} - ${doc.module} - ${doc.section} - ${date} - v${doc.version}`;
}

function categoryPath(sectionCode: string): string {
  return VAULT_CATEGORIES.find((c) => c.section_code === sectionCode)?.path ?? "";
}

export function VaultDocumentList({ documents, showCategoryPath, basePath }: Props) {
  const navigate = useNavigate();
  const params = useParams();

  if (documents.length === 0) {
    return <div className="vault-empty">No VAULT documents match this filter.</div>;
  }

  const open = (doc: VaultDocument) => {
    const id = params.id;
    const path = basePath.replace(":id", id ?? "");
    navigate(`${path}/document/${doc.id}`);
  };

  return (
    <div>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="vault-doc-row"
          role="button"
          tabIndex={0}
          onClick={() => open(doc)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open(doc);
            }
          }}
        >
          <div>
            {showCategoryPath && (
              <div className="vault-category-path">{categoryPath(doc.section_code)}</div>
            )}
            <div className="vault-doc-title">{buildTitle(doc)}</div>
            <div className="vault-doc-meta">
              <span>Signed off by {doc.signed_off_by ?? "—"}</span>
              <span>{formatDate(doc.signed_off_at ?? doc.created_at)}</span>
              <VaultStatusBadge status={doc.status} />
            </div>
            {doc.ai_provenance && (
              <div className="vault-provenance">
                AI confidence {doc.ai_provenance.confidence}% · {doc.ai_provenance.citations_count} citations
              </div>
            )}
          </div>
          <div className="vault-version-pill">v{doc.version}</div>
        </div>
      ))}
    </div>
  );
}
