import { ECard } from "./ECard";
import { NAMING_COMPONENTS } from "./data/section-data";

export function FileNamingSection() {
  return (
    <>
      <ECard
        title="MASTER FORMULA"
        saved="CompanyName_LogoType_Orientation_ColorMode_Background_FileUse_Version.ext"
      />
      <div className="vb-grid-4">
        {NAMING_COMPONENTS.map((c) => (
          <ECard key={c.t} title={c.t} desc={c.d} />
        ))}
      </div>
    </>
  );
}
