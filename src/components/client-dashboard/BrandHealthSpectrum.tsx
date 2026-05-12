interface BrandHealthSpectrumProps {
  score: number;
}

const segments = [
  { min: 0, max: 20, label: "LIQUIDATION", color: "text-spectrum-liquidation" },
  { min: 21, max: 40, label: "EXIT UNLIKELY", color: "text-spectrum-exit-unlikely" },
  { min: 41, max: 60, label: "DISRUPTION IMMINENT", color: "text-spectrum-disruption" },
  { min: 61, max: 75, label: "MARKET VULNERABLE", color: "text-spectrum-vulnerable" },
  { min: 76, max: 90, label: "EXIT POSSIBLE", color: "text-spectrum-exit-possible" },
  { min: 91, max: 100, label: "EXIT READY", color: "text-spectrum-exit-ready" },
];

function getStatusLabel(score: number): { label: string; color: string } {
  const segment = segments.find((s) => score >= s.min && score <= s.max);
  return segment || { label: "UNKNOWN", color: "text-foreground-muted" };
}

export function BrandHealthSpectrum({ score }: BrandHealthSpectrumProps) {
  const status = getStatusLabel(score);
  const markerPosition = `${score}%`;

  return (
    <div className="bg-card border border-border p-8 mt-8" data-tour="brand-spectrum">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-[72px] font-bold text-gold leading-none">{score}</span>
          <span className="text-[24px] text-foreground-secondary">/100</span>
          <span className="ml-4 text-[10px] font-bold tracking-[1px] px-2 py-1 bg-success-dim text-success">
            {status.label}
          </span>
        </div>
        <span className="text-[11px] font-bold tracking-[2px] text-foreground-secondary uppercase">
          Brand Health Spectrum
        </span>
      </div>

      {/* Spectrum Bar */}
      <div className="relative">
        <div
          className="h-5 w-full rounded-full"
          style={{
            background: "linear-gradient(to right, #5d1414 0%, #8b2020 20%, #c45c00 40%, #c9a227 60%, #5a8a3a 80%, #78b956 100%)",
          }}
        />
        {/* Position Marker */}
        <div
          className="absolute top-0 -translate-x-1/2"
          style={{ left: markerPosition }}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white" />
          <div className="w-1 h-5 bg-white mx-auto" />
        </div>
      </div>

      {/* Segment Labels */}
      <div className="grid grid-cols-6 mt-3">
        {segments.map((segment) => (
          <div key={segment.label} className="text-center">
            <div className="text-[9px] font-bold tracking-[1px] text-foreground-muted mb-1">
              {segment.min}-{segment.max}
            </div>
            <div className={`text-[8px] font-bold tracking-[0.5px] ${segment.color}`}>
              {segment.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
