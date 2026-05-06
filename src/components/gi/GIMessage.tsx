// GIMessage — renders a single GI conversation message.
// Supports narration / nudge / response (AI) / user / frank-prompt rendering.
// Inline **bold** and link substitution via renderInline.

import { Icon } from "@/components/sum/icons";
import type { GiMessage } from "@/data/sum-data";
import type { SaveDestination } from "@/hooks/useGI";

interface Props {
  m: GiMessage;
  savePickerFor: string | null;
  onOpenSave: (id: string) => void;
  onSave: (id: string, dest: SaveDestination) => void;
  onCloseSave: () => void;
}

const renderInline = (
  text: string,
  links?: { label: string; target: string }[],
): (string | JSX.Element)[] => {
  // Parse **bold** spans.
  const parts: (string | JSX.Element)[] = [];
  let cursor = 0;
  let i = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push(
      <strong key={`b-${i++}`} style={{ color: "var(--sum-gold)", fontWeight: 800 }}>
        {m[1]}
      </strong>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  if (!links?.length) return parts;
  // Wrap link labels.
  return parts.flatMap((p, idx) => {
    if (typeof p !== "string") return [p];
    let chunk: (string | JSX.Element)[] = [p];
    links.forEach((lk) => {
      const next: (string | JSX.Element)[] = [];
      chunk.forEach((c) => {
        if (typeof c !== "string") {
          next.push(c);
          return;
        }
        const split = c.split(lk.label);
        split.forEach((s, k) => {
          if (k > 0)
            next.push(
              <span
                key={`l-${idx}-${k}-${lk.target}`}
                style={{
                  color: "var(--sum-gold)",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                data-gi-link={lk.target}
              >
                {lk.label}
              </span>,
            );
          if (s) next.push(s);
        });
      });
      chunk = next;
    });
    return chunk;
  });
};

export function GIMessageView({ m, savePickerFor, onOpenSave, onSave, onCloseSave }: Props) {
  const isAi = m.role === "ai";
  const labelText =
    m.type === "narration" ? "NARRATION"
      : m.type === "nudge" ? "NUDGE"
      : m.type === "response" ? "RESPONSE"
      : "";

  const accent = m.type === "nudge" ? "var(--sum-green)" : "var(--sum-gold)";
  const bg = m.type === "nudge" ? "rgba(95,204,0,0.06)" : "rgba(226,181,63,0.06)";

  const bubbleStyle: React.CSSProperties = isAi
    ? {
        padding: "11px 14px",
        fontSize: 12,
        lineHeight: 1.65,
        color: "var(--sum-gold2)",
        background: bg,
        borderLeft: `2px solid ${accent}`,
      }
    : {
        padding: "11px 14px",
        fontSize: 12,
        lineHeight: 1.65,
        background: "var(--sum-bg3)",
        alignSelf: "flex-end",
        color: "var(--sum-tx2)",
      };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {isAi && labelText && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "var(--sum-tx5)", letterSpacing: 0.5, fontWeight: 700 }}>
          <span style={{ color: accent, letterSpacing: 1 }}>{labelText}</span>
          <span>·</span>
          <span>{m.timestamp}</span>
        </div>
      )}
      <div style={bubbleStyle}>{renderInline(m.text, m.links)}</div>

      {/* Frank-mode prompt rendered as gold-bordered card under the response. */}
      {m.frankMode && (
        <div style={{ padding: "10px 14px", border: "1px solid var(--sum-gold)", background: "rgba(226,181,63,0.05)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: "var(--sum-tx2)", lineHeight: 1.55 }}>
            I notice this is a moment where directness might help more than diplomacy. <strong style={{ color: "var(--sum-gold)" }}>Can I be frank?</strong>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ padding: "5px 10px", background: "var(--sum-gold)", color: "#000", fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>YES, BE FRANK</button>
            <button style={{ padding: "5px 10px", background: "transparent", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 10, fontWeight: 700 }}>NOT RIGHT NOW</button>
          </div>
        </div>
      )}

      {/* SAVE control under every AI message. */}
      {isAi && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          {m.savedTo ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--sum-green)", fontWeight: 700, letterSpacing: 0.5 }}>
              <Icon name="check" size={10} />
              {m.savedTo === "vault" ? "Saved to VAULT" : "Saved to Personal Timeline"}
            </span>
          ) : savePickerFor === m.id ? (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button onClick={() => onSave(m.id, "vault")} style={{ padding: "3px 8px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx2)", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>VAULT</button>
              <button onClick={() => onSave(m.id, "timeline")} style={{ padding: "3px 8px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx2)", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>TIMELINE</button>
              <button onClick={onCloseSave} style={{ padding: 2, color: "var(--sum-tx5)" }} title="Cancel"><Icon name="x" size={10} /></button>
            </div>
          ) : (
            <button onClick={() => onOpenSave(m.id)} style={{ fontSize: 10, color: "var(--sum-tx5)", fontWeight: 700, letterSpacing: 0.5 }}>SAVE</button>
          )}
        </div>
      )}
    </div>
  );
}
