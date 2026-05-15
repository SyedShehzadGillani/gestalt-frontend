import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { VaultWatermarkBar } from "@/components/vault/VaultWatermarkBar";
import { VaultDocumentRenderer } from "@/components/vault/VaultDocumentRenderer";
import { getVaultDocumentById, getVaultDocumentsBySectionCode } from "@/data/vault-mock";
import type { VaultDocument } from "@/data/vault-types";
import { toast } from "@/hooks/use-toast";
import "@/components/vault/vault.css";

interface Props {
  basePath: string;
}

export default function VaultDocumentView({ basePath }: Props) {
  const { docId, id } = useParams();
  const navigate = useNavigate();
  const archive = useMemo(() => (docId ? getVaultDocumentById(docId) : undefined), [docId]);
  const [liveCopy, setLiveCopy] = useState<VaultDocument | null>(null);

  if (!archive) {
    const browsePath = basePath.replace(":id", id ?? "");
    return (
      <div className="vault-scope p-6">
        <p className="text-[13px] text-foreground-secondary">
          VAULT document not found.{" "}
          <Link to={browsePath} className="underline">
            Back to VAULT
          </Link>
        </p>
      </div>
    );
  }

  const makeCopy = () => {
    const versions = getVaultDocumentsBySectionCode(archive.section_code);
    const maxVersion = versions.reduce((m, d) => Math.max(m, d.version), 0);
    const copy: VaultDocument = {
      ...archive,
      id: `${archive.id}-live`,
      version: maxVersion + 1,
      status: "live_copy",
      signed_off_by: null,
      signed_off_at: null,
      parent_id: archive.id,
      created_at: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(archive.data)),
    };
    setLiveCopy(copy);
  };

  const saveDraft = () => {
    toast({ title: "Draft saved", description: "Live copy stored locally for this session." });
  };

  const activeDoc = liveCopy ?? archive;
  const mode = liveCopy ? "live_copy" : "archive";
  const browsePath = basePath.replace(":id", id ?? "");

  return (
    <div className="vault-scope">
      <VaultWatermarkBar
        mode={mode}
        doc={activeDoc}
        parentVersion={liveCopy ? archive.version : undefined}
        parentDateIso={liveCopy ? archive.signed_off_at ?? archive.created_at : undefined}
        onMakeCopy={makeCopy}
        onSaveDraft={saveDraft}
      />
      <div className={`vault-doc-body${mode === "archive" ? " vault-doc-readonly" : ""}`}>
        <div className="vault-category-path mb-2">
          <button
            type="button"
            onClick={() => navigate(browsePath)}
            className="vault-wm-action underline"
          >
            ← VAULT
          </button>
        </div>
        <h1 className="text-[22px] font-semibold text-foreground mb-1">
          {activeDoc.company_name} — {activeDoc.section}
        </h1>
        <div className="text-[12px] text-foreground-secondary mb-4">
          {activeDoc.module} · {activeDoc.section_code} · v{activeDoc.version}
        </div>
        <VaultDocumentRenderer doc={activeDoc} />
      </div>
    </div>
  );
}
