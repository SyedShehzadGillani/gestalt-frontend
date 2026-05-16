import { VaultBrandLayout, VaultBrandSection } from "@/components/vault-brand-assets/VaultBrandLayout";
import { VAULT_SECTIONS } from "@/components/vault-brand-assets/nav-config";
import { BrandFoundationSection } from "@/components/vault-brand-assets/BrandFoundationSection";
import { MessagingSection } from "@/components/vault-brand-assets/MessagingSection";
import { ColorSystemSection } from "@/components/vault-brand-assets/ColorSystemSection";
import { TypographySection } from "@/components/vault-brand-assets/TypographySection";
import { PhotographySection } from "@/components/vault-brand-assets/PhotographySection";
import { VideoLibrarySection } from "@/components/vault-brand-assets/VideoLibrarySection";
import { MotionSection } from "@/components/vault-brand-assets/MotionSection";

const IMPLEMENTED: Record<string, () => JSX.Element> = {
  foundation: BrandFoundationSection,
  messaging: MessagingSection,
  color: ColorSystemSection,
  typography: TypographySection,
  photography: PhotographySection,
  video: VideoLibrarySection,
  motion: MotionSection,
};

export default function BrandAssetsVault() {
  return (
    <VaultBrandLayout>
      {VAULT_SECTIONS.map((s) => {
        const Impl = IMPLEMENTED[s.id];
        return (
          <VaultBrandSection key={s.id} id={s.id} title={s.label} defaultClosed={s.defaultClosed}>
            {Impl ? (
              <Impl />
            ) : (
              <div className="vb-placeholder">{s.label} — content lands in subsequent phases.</div>
            )}
          </VaultBrandSection>
        );
      })}
    </VaultBrandLayout>
  );
}
