interface Props {
  types: Array<"S" | "D" | "I">;
  size?: "small" | "normal";
}

const META: Record<"S" | "D" | "I", { color: string; label: string }> = {
  S: { color: "#58d3ff", label: "SURPRISE" },
  D: { color: "#e3398c", label: "DELIGHT" },
  I: { color: "#9aca3e", label: "INSPIRE" },
};

/** S+D+I badges — colored rectangles with labels. Direct port of `SDI`. */
export function SDIBadges({ types, size = "normal" }: Props) {
  const sizing =
    size === "small"
      ? "px-1.5 py-px text-[6px] tracking-[1px]"
      : "px-2 py-0.5 text-[7px] tracking-[2px]";
  return (
    <div className="flex gap-[3px] flex-wrap">
      {types.map((t) => {
        const meta = META[t];
        return (
          <span
            key={t}
            className={`inline-block font-bold ${sizing}`}
            style={{ color: meta.color, border: `1px solid ${meta.color}`, background: `${meta.color}15` }}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}
