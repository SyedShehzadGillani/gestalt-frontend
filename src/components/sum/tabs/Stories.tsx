// Stories — STORY ENGINE tab (v15 spec §4.4).
// Pure render. Sort, open story, RIFF input, composer state owned by ClientMessaging.
// LOVED badge: all 6 D.E.S.I.R.E. pillars filled + ≥5 votes + no brand flag (sum-utils.isLoved).

import { useMemo } from "react";
import { Icon } from "@/components/sum/icons";
import { ENTRY_TYPES, STORY_POSTS, type StoryPost } from "@/data/sum-data";
import { isLoved } from "@/lib/sum-utils";

export type StorySort = "best" | "new";

interface Props {
  sort: StorySort;
  onSort: (s: StorySort) => void;
  openId: number | null;
  onOpenId: (id: number | null) => void;
  composerOpen: boolean;
  onComposerOpen: (v: boolean) => void;
}

const STATUS: Record<string, { label: string; color: string }> = {
  voting: { label: "VOTING", color: "var(--sum-tx3)" },
  approved: { label: "FORMULA-APPROVED", color: "var(--sum-green)" },
  "moving-to-formula": { label: "MOVING TO FORMULA", color: "var(--sum-gold)" },
  "brand-review": { label: "BRAND REVIEW PENDING", color: "#f97316" },
};

export function Stories({ sort, onSort, openId, onOpenId, composerOpen, onComposerOpen }: Props) {
  const posts = useMemo(() => {
    const out = STORY_POSTS.slice();
    if (sort === "best") out.sort((a, b) => b.votes - a.votes);
    else out.sort((a, b) => a.days - b.days);
    return out;
  }, [sort]);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>STORY ENGINE</div>
          <div style={{ fontSize: 14, color: "var(--sum-tx3)", marginTop: 4, maxWidth: 520 }}>Employee ideas submitted, voted, and RIFFed. Top ideas roll into the quarterly FORMULA harvest.</div>
        </div>
        <button onClick={() => onComposerOpen(true)} className="smooth" style={{ padding: "10px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={14} /><span>SUBMIT IDEA</span>
        </button>
      </div>
      <div style={{ padding: "22px 28px", background: "rgba(95,204,0,0.06)", border: "1px solid rgba(95,204,0,0.2)", marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <Icon name="crown" size={18} color="var(--sum-green)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "var(--sum-green)" }}>QUARTERLY FORMULA HARVEST — Q1 2026</div>
          <div style={{ fontSize: 12, color: "var(--sum-tx3)", marginTop: 2 }}>
            Top 5 ideas by votes will be presented to leadership in the FORMULA review on April 15. <strong style={{ color: "var(--sum-tx2)" }}>23 days remaining.</strong>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)" }}>SORT:</span>
        {(["best", "new"] as const).map((s) => (
          <button key={s} onClick={() => onSort(s)} className="smooth"
            style={{ padding: "5px 10px", border: `1px solid ${sort === s ? "var(--sum-gold)" : "var(--sum-bdr)"}`, background: sort === s ? "rgba(226,181,63,0.1)" : "transparent", color: sort === s ? "var(--sum-gold)" : "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      {posts.map((p) => <StoryCard key={p.id} post={p} expanded={openId === p.id} onToggle={() => onOpenId(openId === p.id ? null : p.id)} />)}
      {composerOpen && <ComposerModal onClose={() => onComposerOpen(false)} />}
    </div>
  );
}

function StoryCard({ post: p, expanded, onToggle }: { post: StoryPost; expanded: boolean; onToggle: () => void }) {
  const statusMeta = STATUS[p.status] ?? { label: p.status, color: "var(--sum-tx3)" };
  const filled = p.solve ? Object.values(p.solve).filter(Boolean).length : 0;
  const loved = isLoved(p);
  return (
    <div className="smooth" onClick={onToggle} style={{ padding: "22px 28px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", borderLeft: loved ? "3px solid var(--sum-green)" : undefined, marginBottom: 14, cursor: "pointer", display: "flex", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 46 }}>
        <button className="smooth" style={{ padding: 4, color: "var(--sum-tx4)" }} onClick={(e) => e.stopPropagation()}><Icon name="up" size={16} /></button>
        <span style={{ fontSize: 18, fontWeight: 900, color: "var(--sum-gold)" }}>{p.votes}</span>
        <span style={{ fontSize: 11, color: "var(--sum-tx5)", letterSpacing: 1 }}>VOTES</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {p.types.map((tid) => {
            const t = ENTRY_TYPES.find((x) => x.id === tid);
            if (!t) return null;
            return <span key={tid} style={{ padding: "2px 7px", background: `color-mix(in srgb, ${t.color} 15%, transparent)`, color: t.color, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>{tid}</span>;
          })}
          {loved && <span style={{ padding: "2px 8px", background: "var(--sum-green)", color: "#000", fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>LOVED</span>}
          {p.brandFlag && (
            <span style={{ padding: "2px 8px", background: "rgba(249,115,22,0.15)", color: "#f97316", fontSize: 11, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 3 }}>
              <Icon name="alert" size={10} /> {p.brandFlag}
            </span>
          )}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{p.title}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--sum-tx3)" }}>{p.author}</span>
          <span style={{ fontSize: 11, color: "var(--sum-tx5)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--sum-tx4)" }}>{p.dept}</span>
          <span style={{ fontSize: 11, color: "var(--sum-tx5)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--sum-tx4)" }}>{p.days}d ago</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--sum-tx3)", lineHeight: 1.7, marginTop: 14 }}>
          {expanded ? p.body : (p.body.length > 180 ? p.body.slice(0, 180) + "..." : p.body)}
        </div>
        {expanded && p.solve && (
          <div style={{ marginTop: 14, padding: 14, background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "var(--sum-gold)", marginBottom: 10 }}>D.E.S.I.R.E. STRUCTURE — {filled}/6</div>
            {Object.entries(p.solve).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: v ? "var(--sum-gold)" : "var(--sum-tx5)", letterSpacing: 1 }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: v ? "var(--sum-tx2)" : "var(--sum-tx5)", lineHeight: 1.55, marginTop: 2, fontStyle: v ? "normal" : "italic" }}>
                  {v || "(empty — your team can RIFF to fill this)"}
                </div>
              </div>
            ))}
          </div>
        )}
        {expanded && p.riffs.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 8 }}>RIFFS ({p.riffs.length})</div>
            {p.riffs.map((r) => (
              <div key={r.id} style={{ padding: "10px 14px", background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--sum-tx4)" }}>
                  <span style={{ fontWeight: 700, color: "var(--sum-tx2)" }}>{r.author}</span>
                  <span>·</span><span>{r.days}d ago</span>
                  {r.fieldFilled && <span style={{ color: "var(--sum-gold)", fontWeight: 700 }}>· filled {r.fieldFilled.toUpperCase()}</span>}
                </div>
                <div style={{ fontSize: 13, color: "var(--sum-tx2)", lineHeight: 1.55, marginTop: 4 }}>{r.body}</div>
              </div>
            ))}
          </div>
        )}
        {expanded && p.aiNote && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#f97316" }}>BRAND FILTER NOTE</div>
            <div style={{ fontSize: 12, color: "var(--sum-tx3)", lineHeight: 1.55, marginTop: 4 }}>{p.aiNote}</div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
          {p.solve && (
            <span style={{ fontSize: 12, color: filled === 6 ? "var(--sum-green)" : "var(--sum-blue)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="sparkles" size={12} />D.E.S.I.R.E. {filled}/6
            </span>
          )}
          <span style={{ fontSize: 12, color: "var(--sum-tx3)", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="msg" size={12} />{p.riffs.length} {p.riffs.length === 1 ? "riff" : "riffs"}
          </span>
          {p.tags.slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <div style={{ padding: "3px 8px", background: `color-mix(in srgb, ${statusMeta.color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${statusMeta.color} 30%, transparent)`, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: statusMeta.color, textAlign: "center" }}>
          {statusMeta.label}
        </div>
      </div>
    </div>
  );
}

function ComposerModal({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", maxWidth: 580, width: "100%", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Submit Idea to STORY ENGINE</div>
          <button onClick={onClose} style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ fontSize: 12, color: "var(--sum-tx4)", lineHeight: 1.55, marginBottom: 14 }}>
          Sharing makes this visible to everyone in the company. AI will scan for confidential terms before posting.
        </div>
        <input placeholder="Idea title..." className="sum-input-pulse" style={{ width: "100%", padding: "10px 12px", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", marginBottom: 10, fontSize: 14, color: "inherit" }} />
        <textarea placeholder="What's the idea? Why now?" className="sum-input-pulse" style={{ width: "100%", minHeight: 120, padding: "10px 12px", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", marginBottom: 14, fontSize: 14, lineHeight: 1.6, resize: "vertical", color: "inherit" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "8px 14px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>CANCEL</button>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800 }}>NEXT</button>
        </div>
      </div>
    </div>
  );
}
