import { useState } from "react";
import { X, Settings, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useParams } from "react-router-dom";

interface CitationData {
  confidence: number;
  sources: string;
  roi: string;
  impact: string;
}

interface InsightCardProps {
  title: string;
  collapsedContent: React.ReactNode;
  expandedContent: React.ReactNode;
  onDismiss: () => void;
  showGestaltIcon?: boolean;
  citation: CitationData;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ConfidenceBar = ({ confidence }: { confidence: number }) => (
  <div className="inline-flex items-center gap-1.5">
    <span className="text-[#8b949e]">{confidence}% confidence</span>
    <div className="w-10 h-1 bg-[#2d333b] rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#c9a227] rounded-full" 
        style={{ width: `${confidence}%` }}
      />
    </div>
  </div>
);

const PriorityBadge = ({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) => {
  const colors = {
    HIGH: "bg-red-500/20 text-red-400 border-red-500/30",
    MEDIUM: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    LOW: "bg-[#c9a227]/20 text-[#c9a227] border-[#c9a227]/30",
  };
  return (
    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded border", colors[level])}>
      {level}
    </span>
  );
};

// Donut Chart component for metric cards
const DonutChart = ({
  percentage,
  color,
  size = 40,
}: {
  percentage: number;
  color: string;
  size?: number;
}) => {
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg style={{ width: size, height: size }} className="transform -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/20" />
        <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="3" fill="none" strokeDasharray={strokeDasharray} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
};

// Spark line component
const SparkLine = () => {
  const points = [2150, 2280, 2340, 2290, 2450, 2380, 2520, 2480, 2600];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;
  const pathData = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 100 - ((point - min) / range) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <div className="w-20 h-6 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathData}
          stroke="#c9a227"
          strokeWidth="2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const InsightCard = ({ 
  title, 
  collapsedContent, 
  expandedContent, 
  onDismiss, 
  showGestaltIcon, 
  citation,
  isExpanded,
  onToggleExpand,
}: InsightCardProps) => {
  return (
    <div 
      className={cn(
        "group relative bg-sidebar border border-sidebar-border rounded-sm hover:border-[#3d434b] transition-all duration-200 ease-out",
        isExpanded ? "min-w-[320px] flex-[2]" : "min-w-[240px] flex-1"
      )}
    >
      
      <div className="p-3 pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div 
            className="flex items-center gap-2 cursor-pointer flex-1"
            onClick={onToggleExpand}
          >
            <h3 className="text-[10px] font-semibold tracking-widest text-[#8b949e] uppercase">
              {title}
            </h3>
            <div className="text-[#8b949e] transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {showGestaltIcon && (
              <div className="w-4 h-4 rounded-sm border border-[#c9a227] flex items-center justify-center">
                <Settings className="h-2.5 w-2.5 text-[#c9a227]" />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="text-[#8b949e] hover:text-white transition-colors p-0.5"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
        {/* Content with transition */}
        <div 
          className="cursor-pointer"
          onClick={onToggleExpand}
        >
          <div className={cn(
            "transition-all duration-200 ease-out overflow-hidden",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            {expandedContent}
          </div>
          <div className={cn(
            "transition-all duration-200 ease-out overflow-hidden",
            !isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}>
            {collapsedContent}
          </div>
        </div>
        
        {/* Citation Footer */}
        <div className="mt-3 pt-2 border-t border-[#2d333b]">
          <p className="text-[9px] leading-relaxed text-[#8b949e]">
            <ConfidenceBar confidence={citation.confidence} />
            <span className="mx-1">·</span>
            <span>{citation.sources}</span>
            <br />
            <span className="mx-0">ROI: </span>
            <span className="text-[#c9a227]">{citation.roi}</span>
            <span className="mx-1">·</span>
            <span>Impact: {citation.impact}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

interface EmployeeCardContentProps {
  imageSrc: string;
  name: string;
  score: number;
  subtitle: string;
}

const EmployeeCardContent = ({ imageSrc, name, score, subtitle }: EmployeeCardContentProps) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[#2d333b] overflow-hidden flex-shrink-0">
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white truncate">{name}</span>
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#c9a227]/20 text-[#c9a227] flex-shrink-0">
          {score}%
        </span>
      </div>
      <p className="text-xs text-[#8b949e] mt-0.5">{subtitle}</p>
    </div>
  </div>
);

// Metric card content with donut
const MetricCardContent = ({ 
  icon, 
  value, 
  percentage, 
  color 
}: { 
  icon?: React.ReactNode; 
  value: string; 
  percentage: number; 
  color: string;
}) => (
  <div className="flex items-center gap-3">
    {icon && (
      <div className="w-8 h-8 bg-[#c9a227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
    <DonutChart percentage={percentage} color={color} size={40} />
  </div>
);

// Revenue card content with sparkline
const RevenueCardContent = ({ value, subtitle }: { value: string; subtitle: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 min-w-0">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-[10px] text-[#8b949e]">{subtitle}</div>
    </div>
    <SparkLine />
  </div>
);

// Expanded Content Components
const DailyReportExpanded = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  
  const priorities = [
    { id: 1, level: "HIGH" as const, text: "Review Palm City score drop — 11 point decline needs manager attention" },
    { id: 2, level: "MEDIUM" as const, text: "Complete Q1 reviews for Stuart location — 4 overdue" },
    { id: 3, level: "LOW" as const, text: "Recognize Hobe Sound improvement — +16 points, share with team" },
  ];

  return (
    <div className="space-y-2.5">
      {priorities.map((priority) => (
        <div key={priority.id} className="flex items-start gap-2">
          <Checkbox 
            checked={checked[priority.id] || false}
            onCheckedChange={(val) => {
              setChecked(prev => ({ ...prev, [priority.id]: !!val }));
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 h-3.5 w-3.5 border-[#8b949e] data-[state=checked]:bg-[#c9a227] data-[state=checked]:border-[#c9a227]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[#8b949e] text-xs">{priority.id}.</span>
              <PriorityBadge level={priority.level} />
            </div>
            <p className={cn(
              "text-xs leading-relaxed",
              checked[priority.id] ? "text-[#8b949e] line-through" : "text-white"
            )}>
              {priority.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const MostImprovedExpanded = () => (
  <div className="space-y-3">
    <EmployeeCardContent
      imageSrc="/lovable-uploads/michael-anderson.png"
      name="Michael Anderson"
      score={78}
      subtitle="+12 points in 30 days"
    />
    <div className="space-y-2 pt-2 border-t border-[#2d333b]">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#8b949e]">Score timeline:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#8b949e]">66</span>
          <span className="text-xs text-[#8b949e]">→</span>
          <span className="text-xs text-[#c9a227] font-medium">78</span>
          <span className="text-[9px] text-[#8b949e]">over 30 days</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs px-1.5 py-0.5 rounded bg-[#4169E1]/20 text-[#4169E1]">KNOWLEDGE +8</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700]">STAFF +4</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 text-xs border-[#2d333b] bg-transparent hover:bg-[#2d333b] text-white mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        View Full Profile
      </Button>
    </div>
  </div>
);

const HighImpactExpanded = () => (
  <div className="space-y-3">
    <EmployeeCardContent
      imageSrc="/lovable-uploads/david-johnson.png"
      name="David Johnson"
      score={94}
      subtitle="Top 5% — protect and promote"
    />
    <div className="space-y-1.5 pt-2 border-t border-[#2d333b]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">Culture multiplier:</span>
        <span className="text-xs text-[#c9a227] font-medium">3.2x</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">Retention value:</span>
        <span className="text-xs text-[#c9a227] font-medium">$156,000</span>
      </div>
      <p className="text-xs text-white pt-1">
        <span className="text-[#8b949e]">Recommendation:</span> Formalize mentorship role
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 text-xs border-[#2d333b] bg-transparent hover:bg-[#2d333b] text-white mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        View Full Profile
      </Button>
    </div>
  </div>
);

const MakingWavesExpanded = () => {
  const { id } = useParams<{ id: string }>();
  const addLocationPath = `/client/${id}/hive/add-location`;
  return (
  <div className="space-y-3">
    <Link
      to={addLocationPath}
      className="block p-2 rounded bg-[#2d333b]/30 hover:bg-[#2d333b]/50 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start gap-2">
        <span className="text-[#FF8C00] text-sm">▼</span>
        <div>
          <p className="text-sm text-white">
            <span className="font-medium">Palm City:</span> 72 → 61 
            <span className="text-[#FF8C00] font-medium"> (-11)</span>
          </p>
          <p className="text-xs text-[#8b949e] mt-0.5">
            STAFF quadrant driving decline. 3 employees below threshold.
          </p>
        </div>
      </div>
    </Link>
    <Link
      to={addLocationPath}
      className="block p-2 rounded bg-[#2d333b]/30 hover:bg-[#2d333b]/50 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start gap-2">
        <span className="text-[#00CC00] text-sm">▲</span>
        <div>
          <p className="text-sm text-white">
            <span className="font-medium">Hobe Sound:</span> 62 → 78
            <span className="text-[#00CC00] font-medium"> (+16)</span>
          </p>
          <p className="text-xs text-[#8b949e] mt-0.5">
            PATIENT scores surging. New training program working.
          </p>
        </div>
      </div>
    </Link>
  </div>
  );
};

// Expanded content for Top Clinic
const TopClinicExpanded = () => (
  <div className="space-y-3">
    <MetricCardContent 
      icon={<TrendingUp className="w-4 h-4 text-[#c9a227]" />}
      value="$2,150K"
      percentage={87}
      color="#c9a227"
    />
    <div className="space-y-1.5 pt-2 border-t border-[#2d333b]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">vs Last Quarter:</span>
        <span className="text-xs text-[#00CC00] font-medium">+8.5%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">vs Target:</span>
        <span className="text-xs text-[#c9a227] font-medium">93%</span>
      </div>
      <p className="text-xs text-white pt-1">
        <span className="text-[#8b949e]">Location:</span> VGH Medical Center
      </p>
    </div>
  </div>
);

// Expanded content for Holdings Revenue
const HoldingsRevenueExpanded = () => (
  <div className="space-y-3">
    <RevenueCardContent value="$2,150K" subtitle="YOY Growth" />
    <div className="space-y-1.5 pt-2 border-t border-[#2d333b]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">YoY Change:</span>
        <span className="text-xs text-[#00CC00] font-medium">+12.3%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">Q1 Projection:</span>
        <span className="text-xs text-[#c9a227] font-medium">$2,480K</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">Best Month:</span>
        <span className="text-xs text-white">December</span>
      </div>
    </div>
  </div>
);

const citations: Record<string, CitationData> = {
  dailyReport: {
    confidence: 87,
    sources: "Gallup, SHRM, Internal Data",
    roi: "$34K/week",
    impact: "Immediate",
  },
  mostImproved: {
    confidence: 91,
    sources: "Deloitte, ATD, Internal Trend",
    roi: "$22K/year",
    impact: "30 days",
  },
  highImpact: {
    confidence: 94,
    sources: "HBR, McKinsey, Gallup",
    roi: "$156K retention",
    impact: "Ongoing",
  },
  makingWaves: {
    confidence: 82,
    sources: "BLS, Internal Data, Industry Avg",
    roi: "$8.5K/point",
    impact: "7-14 days",
  },
  topClinic: {
    confidence: 95,
    sources: "Internal Revenue, Market Data",
    roi: "$2.1M annual",
    impact: "Quarterly",
  },
  holdingsRevenue: {
    confidence: 98,
    sources: "Financial Reports, Forecasts",
    roi: "$2.15M YTD",
    impact: "YoY",
  },
};

export function GestaltInsightCards() {
  const [visibleCards, setVisibleCards] = useState({
    dailyReport: true,
    mostImproved: true,
    highImpact: true,
    makingWaves: true,
    topClinic: true,
    holdingsRevenue: true,
  });

  const [expandedCards, setExpandedCards] = useState({
    dailyReport: false,
    mostImproved: false,
    highImpact: false,
    makingWaves: false,
    topClinic: false,
    holdingsRevenue: false,
  });

  const dismissCard = (cardKey: keyof typeof visibleCards) => {
    setVisibleCards((prev) => ({ ...prev, [cardKey]: false }));
  };

  const toggleExpand = (cardKey: keyof typeof expandedCards) => {
    setExpandedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  const anyVisible = Object.values(visibleCards).some(Boolean);

  if (!anyVisible) return null;

  return (
    <div className="mb-6 overflow-x-auto scrollbar-thin scrollbar-track-[#1a1f2c] scrollbar-thumb-[#c9a227]/40 hover:scrollbar-thumb-[#c9a227]/60 pb-2">
      <div className="flex gap-4 min-w-max">
        {visibleCards.dailyReport && (
          <InsightCard
            title="Daily Report"
            onDismiss={() => dismissCard("dailyReport")}
            showGestaltIcon
            citation={citations.dailyReport}
            isExpanded={expandedCards.dailyReport}
            onToggleExpand={() => toggleExpand("dailyReport")}
            collapsedContent={
              <p className="text-sm text-white leading-relaxed">
                3 priorities today. 2 reviews due.
                <br />
                1 score alert at Palm City.
              </p>
            }
            expandedContent={<DailyReportExpanded />}
          />
        )}

        {visibleCards.highImpact && (
          <InsightCard
            title="Highest Performing"
            onDismiss={() => dismissCard("highImpact")}
            citation={citations.highImpact}
            isExpanded={expandedCards.highImpact}
            onToggleExpand={() => toggleExpand("highImpact")}
            collapsedContent={
              <EmployeeCardContent
                imageSrc="/lovable-uploads/david-johnson.png"
                name="David Johnson"
                score={94}
                subtitle="Top 5% — protect and promote"
              />
            }
            expandedContent={<HighImpactExpanded />}
          />
        )}

        {visibleCards.topClinic && (
          <InsightCard
            title="Top Clinic"
            onDismiss={() => dismissCard("topClinic")}
            citation={citations.topClinic}
            isExpanded={expandedCards.topClinic}
            onToggleExpand={() => toggleExpand("topClinic")}
            collapsedContent={
              <MetricCardContent 
                icon={<TrendingUp className="w-4 h-4 text-[#c9a227]" />}
                value="$2,150K"
                percentage={87}
                color="#c9a227"
              />
            }
            expandedContent={<TopClinicExpanded />}
          />
        )}

        {visibleCards.mostImproved && (
          <InsightCard
            title="Most Improved"
            onDismiss={() => dismissCard("mostImproved")}
            citation={citations.mostImproved}
            isExpanded={expandedCards.mostImproved}
            onToggleExpand={() => toggleExpand("mostImproved")}
            collapsedContent={
              <EmployeeCardContent
                imageSrc="/lovable-uploads/michael-anderson.png"
                name="Michael Anderson"
                score={78}
                subtitle="+12 points in 30 days"
              />
            }
            expandedContent={<MostImprovedExpanded />}
          />
        )}

        {visibleCards.holdingsRevenue && (
          <InsightCard
            title="Holdings Revenue"
            onDismiss={() => dismissCard("holdingsRevenue")}
            citation={citations.holdingsRevenue}
            isExpanded={expandedCards.holdingsRevenue}
            onToggleExpand={() => toggleExpand("holdingsRevenue")}
            collapsedContent={
              <RevenueCardContent value="$2,150K" subtitle="YOY Growth" />
            }
            expandedContent={<HoldingsRevenueExpanded />}
          />
        )}

        {visibleCards.makingWaves && (
          <InsightCard
            title="Making Waves"
            onDismiss={() => dismissCard("makingWaves")}
            citation={citations.makingWaves}
            isExpanded={expandedCards.makingWaves}
            onToggleExpand={() => toggleExpand("makingWaves")}
            collapsedContent={
              <p className="text-sm text-white leading-relaxed">
                Palm City dropped{" "}
                <span className="text-[#FF8C00] font-medium">11 points</span>.
                <br />
                Hobe Sound up{" "}
                <span className="text-[#00CC00] font-medium">16 points</span>.
              </p>
            }
            expandedContent={<MakingWavesExpanded />}
          />
        )}
      </div>
    </div>
  );
}
