interface Props {
  label: string;
  current: number;
  target: number;
  scale: string[];
}

/**
 * Horizontal red→green spectrum bar with NOW + TARGET markers.
 * Direct port of source `SpectrumBar`.
 */
export function SpectrumBar({ label, current, target, scale }: Props) {
  return (
    <div className="mb-[18px]">
      <div className="text-muted-foreground text-[8px] tracking-[2px] mb-[5px]">{label}</div>
      <div
        className="relative h-[22px]"
        style={{ background: "linear-gradient(to right, #5d1414, #c45c00, #e2b53f, #9aca3e)" }}
      >
        <div
          className="absolute top-1/2 w-[10px] h-[10px] border-2 border-white bg-transparent transition-all duration-700"
          style={{ left: `${current}%`, transform: "translate(-50%,-50%)" }}
        >
          <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 text-[6px] text-white font-bold whitespace-nowrap tracking-[1px]">
            NOW
          </span>
        </div>
        <div
          className="absolute top-1/2 w-[10px] h-[10px] border-2 border-white bg-white transition-all duration-700"
          style={{ left: `${target}%`, transform: "translate(-50%,-50%)" }}
        >
          <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 text-[6px] text-white font-bold whitespace-nowrap tracking-[1px]">
            TARGET
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-[3px]">
        {scale.map((s, i) => (
          <span key={i} className="text-muted-foreground text-[6px] tracking-[1px]">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
