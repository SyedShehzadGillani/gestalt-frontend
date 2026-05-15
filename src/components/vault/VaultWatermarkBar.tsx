import { Button } from "@/components/ui/button";
import type { VaultDocument } from "@/data/vault-types";

interface Props {
  mode: "archive" | "live_copy";
  doc: VaultDocument;
  parentVersion?: number;
  parentDateIso?: string;
  onMakeCopy?: () => void;
  onSaveDraft?: () => void;
}

function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function VaultWatermarkBar({
  mode,
  doc,
  parentVersion,
  parentDateIso,
  onMakeCopy,
  onSaveDraft,
}: Props) {
  if (mode === "archive") {
    return (
      <div className="vault-watermark-bar" role="status" aria-live="polite">
        <div className="vault-wm-left">
          <span className="vault-wm-pill">VAULT ARCHIVE</span>
          <span>· v{doc.version}</span>
          <span>· {formatLongDate(doc.signed_off_at ?? doc.created_at)}</span>
          <span>· Signed off by {doc.signed_off_by ?? "—"}</span>
          <span className="vault-wm-readonly">READ ONLY</span>
        </div>
        <Button
          variant="outline"
          className="vault-wm-action border-[rgba(201,162,39,0.6)] text-[rgba(201,162,39,1)] hover:bg-[rgba(201,162,39,0.12)]"
          onClick={onMakeCopy}
        >
          MAKE A COPY →
        </Button>
      </div>
    );
  }

  return (
    <div className="vault-watermark-bar is-live" role="status" aria-live="polite">
      <div className="vault-wm-left">
        <span className="vault-wm-pill">LIVE COPY</span>
        <span>· v{doc.version}</span>
        {parentVersion !== undefined && (
          <span>
            · Created from v{parentVersion} ({formatLongDate(parentDateIso)})
          </span>
        )}
        <span className="vault-wm-readonly">UNSAVED CHANGES</span>
      </div>
      <Button
        variant="outline"
        className="vault-wm-action border-[rgba(88,211,255,0.6)] text-[rgb(88,211,255)] hover:bg-[rgba(88,211,255,0.12)]"
        onClick={onSaveDraft}
      >
        SAVE DRAFT
      </Button>
    </div>
  );
}
