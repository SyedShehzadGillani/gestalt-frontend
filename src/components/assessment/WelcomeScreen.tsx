import { Button } from "@/components/ui/button";
import brandAuditHero from "@/assets/brand-audit-hero.png";

interface WelcomeScreenProps {
  clientName?: string;
  onBegin: () => void;
}

const stats = [
  { value: "25+", label: "Years", sublabel: "Methodology" },
  { value: "21", label: "Points", sublabel: "Data Points" },
  { value: "$1B+", label: "Revenue", sublabel: "Built" },
  { value: "3", label: "Min", sublabel: "Completion Time" },
];

export function WelcomeScreen({ clientName, onBegin }: WelcomeScreenProps) {
  const categories = ["WELCOME", "PERCEPTION", "CLARITY", "IDENTITY", "CULTURE", "EXIT"];
  const currentCategoryIndex = 0; // Welcome is active

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col animate-fade-in px-4 py-8">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[700px] mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-[2px] uppercase">
          {categories.map((cat, index) => (
            <div key={cat} className="flex items-center gap-2">
              <span className={index < currentCategoryIndex ? "text-gold/50" : index === currentCategoryIndex ? "text-gold text-[13px]" : "text-foreground-muted"}>
                {cat}
              </span>
              {index < categories.length - 1 && (
                <span className="text-foreground-muted">/</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Container - anchored at 5vh from top like question pages */}
      <div className="w-full max-w-[600px] mx-auto text-left" style={{ marginTop: '5vh' }}>
        {/* Badge - centered above image */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-dim border border-gold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-gold opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-[11px] font-bold tracking-[2px] text-gold uppercase">
              Free Assessment
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] mb-8 overflow-hidden">
          <img
            src={brandAuditHero}
            alt="Brand Audit"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] md:text-[32px] font-bold text-foreground leading-tight mb-2 text-center">
          FRAMEWORK — 21-PT Assessment
        </h1>

        {/* Subtitle */}
        <p className="text-[16px] text-gold mb-8 text-center">
          In 3 minutes, uncover the blindspots holding back your valuation.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-11">
          {stats.map((stat) => (
            <div key={stat.label} className="text-left">
              <div className="text-[24px] md:text-[28px] font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-[11px] font-bold tracking-[1px] text-gold uppercase">
                {stat.label}
              </div>
              <div className="text-[9px] md:text-[10px] text-foreground-muted">{stat.sublabel}</div>
            </div>
          ))}
        </div>


        {/* Begin Button - Full width on mobile */}
        <Button
          onClick={onBegin}
          className="w-full h-14 text-[18px] font-semibold tracking-[1px] bg-gold/25 border border-gold text-gold hover:bg-gold hover:text-primary-foreground"
        >
          BEGIN ASSESSMENT
        </Button>
      </div>
    </div>
  );
}
