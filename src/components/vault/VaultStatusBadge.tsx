import { Badge } from "@/components/ui/badge";
import type { VaultStatus } from "@/data/vault-types";

const LABELS: Record<VaultStatus, string> = {
  archived: "ARCHIVED",
  draft: "DRAFT",
  live_copy: "LIVE COPY",
};

export function VaultStatusBadge({ status }: { status: VaultStatus }) {
  return (
    <Badge variant="outline" className={`vault-status-${status}`}>
      {LABELS[status]}
    </Badge>
  );
}
