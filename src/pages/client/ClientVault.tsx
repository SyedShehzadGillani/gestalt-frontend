import { Link, useParams } from "react-router-dom";
import { Palette } from "lucide-react";
import { VaultBrowse } from "@/components/vault/VaultBrowse";

export default function ClientVault() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <div className="px-6 pt-6">
        <Link
          to={`/client/${id ?? "northgate"}/vault/brand`}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 hover:border-foreground/30 transition-colors"
        >
          <Palette size={18} className="text-[#e2b53f]" />
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-foreground">BRAND ASSETS</div>
            <div className="text-[12px] text-foreground-secondary">
              Identity guidelines, logos, colors, typography — full brand vault.
            </div>
          </div>
          <span className="text-[12px] text-foreground-secondary">OPEN →</span>
        </Link>
      </div>
      <VaultBrowse basePath="/client/:id/vault" />
    </div>
  );
}
