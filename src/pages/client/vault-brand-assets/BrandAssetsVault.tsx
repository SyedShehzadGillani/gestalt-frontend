import { VaultBrandLayout, VaultBrandSection } from "@/components/vault-brand-assets/VaultBrandLayout";
import { VAULT_SECTIONS } from "@/components/vault-brand-assets/nav-config";

export default function BrandAssetsVault() {
  return (
    <VaultBrandLayout>
      {VAULT_SECTIONS.map((s) => (
        <VaultBrandSection key={s.id} id={s.id} title={s.label} defaultClosed={s.defaultClosed}>
          <div className="vb-placeholder">
            {s.label} — content lands in subsequent phases.
          </div>
        </VaultBrandSection>
      ))}
    </VaultBrandLayout>
  );
}
