import { VaultBrandLayout, VaultBrandSection } from "@/components/vault-brand-assets/VaultBrandLayout";
import { VAULT_SECTIONS } from "@/components/vault-brand-assets/nav-config";
import { BrandFoundationSection } from "@/components/vault-brand-assets/BrandFoundationSection";
import { MessagingSection } from "@/components/vault-brand-assets/MessagingSection";
import { ColorSystemSection } from "@/components/vault-brand-assets/ColorSystemSection";
import { TypographySection } from "@/components/vault-brand-assets/TypographySection";
import { PhotographySection } from "@/components/vault-brand-assets/PhotographySection";
import { VideoLibrarySection } from "@/components/vault-brand-assets/VideoLibrarySection";
import { MotionSection } from "@/components/vault-brand-assets/MotionSection";
import { VisualIdentitySection } from "@/components/vault-brand-assets/VisualIdentitySection";
import { UsageRulesSection } from "@/components/vault-brand-assets/UsageRulesSection";
import { GraphicsSection } from "@/components/vault-brand-assets/GraphicsSection";
import { ApplicationsSection } from "@/components/vault-brand-assets/ApplicationsSection";
import { DigitalBrandSection } from "@/components/vault-brand-assets/DigitalBrandSection";
import { GovernanceSection } from "@/components/vault-brand-assets/GovernanceSection";
import { FileNamingSection } from "@/components/vault-brand-assets/FileNamingSection";
import { FormatsSection } from "@/components/vault-brand-assets/FormatsSection";
import { FolderStructureSection } from "@/components/vault-brand-assets/FolderStructureSection";
import { AssetIndexSection } from "@/components/vault-brand-assets/AssetIndexSection";
import { ReadMeSection } from "@/components/vault-brand-assets/ReadMeSection";
import { ChecklistSection } from "@/components/vault-brand-assets/ChecklistSection";

const IMPLEMENTED: Record<string, () => JSX.Element> = {
  foundation: BrandFoundationSection,
  messaging: MessagingSection,
  color: ColorSystemSection,
  typography: TypographySection,
  photography: PhotographySection,
  video: VideoLibrarySection,
  motion: MotionSection,
  identity: VisualIdentitySection,
  usage: UsageRulesSection,
  graphics: GraphicsSection,
  applications: ApplicationsSection,
  digital: DigitalBrandSection,
  governance: GovernanceSection,
  naming: FileNamingSection,
  formats: FormatsSection,
  folders: FolderStructureSection,
  index: AssetIndexSection,
  readme: ReadMeSection,
  checklist: ChecklistSection,
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
