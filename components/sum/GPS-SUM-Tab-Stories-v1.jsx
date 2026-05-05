// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Stories-v1.jsx
// S.U.M. Module — STORY ENGINE tab
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  Plus, X, ArrowUp, MessageSquare, Sparkles, AlertTriangle, Crown, Forward,
} from "lucide-react";
import {
  STORY_POSTS,
  ENTRY_TYPES,
  DESIRE_FIELDS,
  DESIRE_HINTS,
} from "../../constants/GPS-SUM-Data-v1";

function Tag({ label }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      marginRight: 4,
      marginBottom: 4,
      background: "var(--bg3)",
      color: "var(--tx3)",
      fontSize: "var(--t-micro)",
      fontWeight: 600,
      borderRadius: 2,
    }}>
      #{label}
    </span>
  );
}

export default function SumTabStories(props) {
  const {
    storyOpenId, setStoryOpenId,
    storySort, setStorySort,
  } = props;

  let posts = STORY_POSTS.slice();
  if (storySort === "best") posts.sort((a, b) => b.votes - a.votes);
  else if (storySort === "new") posts.sort((a, b) => a.days - b.days);

  return (
    <>
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <div style={{ padding: "28px 32px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}>
            <div>
              <div style={{ fontSize: "var(--t-h1)", fontWeight: 900, color: "var(--tx)" }}>
                STORY ENGINE
              </div>
              <div style={{
                fontSize: "var(--t-body)",
                color: "var(--tx3)",
                marginTop: 4,
                maxWidth: 520,
              }}>
                Employee ideas submitted, voted, and RIFFed. Top ideas roll into the quarterly FORMULA harvest.
              </div>
            </div>
            <button style={{
              padding: "10px 16px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}>
              <Plus size={14} /><span>SUBMIT IDEA</span>
            </button>
          </div>

          <div style={{
            padding: "22px 28px",
            background: "rgba(95,204,0,0.06)",
            border: "1px solid rgba(95,204,0,0.2)",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderRadius: 2,
          }}>
            <Crown size={18} color="var(--green)" />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "var(--t-caption)",
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "var(--green)",
              }}>
                QUARTERLY FORMULA HARVEST — Q1 2026
              </div>
              <div style={{
                fontSize: "var(--t-caption)",
                color: "var(--tx3)",
                marginTop: 2,
              }}>
                Top 5 ideas by votes will be presented to leadership in the FORMULA review on April 15.{" "}
                <strong style={{ color: "var(--tx2)" }}>23 days remaining.</strong>
              </div>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            alignItems: "center",
          }}>
            <span style={{
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "var(--tx4)",
            }}>
              SORT:
            </span>
            <SortChip label="BEST" active={storySort === "best"} onClick={() => setStorySort("best")} />
            <SortChip label="NEW"  active={storySort === "new"}  onClick={() => setStorySort("new")} />
          </div>

          {posts.map(p => (
            <StoryCard key={p.id} post={p} onOpen={() => setStoryOpenId(p.id)} />
          ))}
        </div>
      </div>

      {storyOpenId !== null && (
        <StoryDetailModal
          postId={storyOpenId}
          onClose={() => setStoryOpenId(null)}
        />
      )}
    </>
  );
}

function SortChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        border: `1px solid ${active ? "var(--gold)" : "var(--bdr)"}`,
        background: active ? "rgba(226,181,63,0.1)" : "transparent",
        color: active ? "var(--gold)" : "var(--tx3)",
        fontSize: "var(--t-caption)",
        fontWeight: 700,
        borderRadius: 2,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const STATUS_META = {
  voting:               { label: "VOTING",                color: "var(--tx3)" },
  "moving-to-formula":  { label: "MOVING TO FORMULA",     color: "var(--gold)" },
  approved:             { label: "FORMULA-APPROVED",      color: "var(--green)" },
  "brand-review":       { label: "BRAND REVIEW PENDING",  color: "#f97316" },
};

function StoryCard({ post, onOpen }) {
  const meta = STATUS_META[post.status] || { label: post.status, color: "var(--tx3)" };
  const filledFields = post.desire ? Object.values(post.desire).filter(v => v && v.trim()).length : 0;
  const isComplete = filledFields === 6;

  return (
    <div
      onClick={onOpen}
      style={{
        padding: "22px 28px",
        background: "var(--bg2)",
        border: "1px solid var(--bdr)",
        borderLeft: post.loved ? "3px solid var(--green)" : "1px solid var(--bdr)",
        borderRadius: 2,
        marginBottom: 14,
        cursor: "pointer",
        display: "flex",
        gap: 18,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          minWidth: 46,
        }}
      >
        <button style={voteBtn}>
          <ArrowUp size={16} />
        </button>
        <span style={{
          fontSize: "var(--t-h3)",
          fontWeight: 900,
          color: "var(--gold)",
        }}>
          {post.votes}
        </span>
        <span style={{
          fontSize: "var(--t-micro)",
          color: "var(--tx5)",
          letterSpacing: 1,
        }}>
          VOTES
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 10,
        }}>
          {post.types.map(tid => {
            const t = ENTRY_TYPES.find(x => x.id === tid);
            return (
              <span key={tid} style={{
                padding: "2px 7px",
                background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                color: t.color,
                fontSize: "var(--t-micro)",
                fontWeight: 800,
                letterSpacing: 1,
                borderRadius: 2,
              }}>
                {tid}
              </span>
            );
          })}
          {post.loved && (
            <span style={{
              padding: "2px 8px",
              background: "var(--green)",
              color: "#000",
              fontSize: "var(--t-micro)",
              fontWeight: 800,
              letterSpacing: 1.5,
              borderRadius: 2,
            }}>
              LOVED
            </span>
          )}
          {post.brandFlag && (
            <span style={{
              padding: "2px 8px",
              background: "rgba(249,115,22,0.15)",
              color: "#f97316",
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 3,
              borderRadius: 2,
            }}>
              <AlertTriangle size={10} /> {post.brandFlag}
            </span>
          )}
        </div>

        <div style={{ fontSize: "var(--t-body-lg)", fontWeight: 700, color: "var(--tx)" }}>
          {post.title}
        </div>

        <div style={{
          display: "flex",
          gap: 8,
          marginTop: 6,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "var(--t-caption)", color: "var(--tx3)" }}>{post.author}</span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>·</span>
          <span style={{ fontSize: "var(--t-caption)", color: "var(--tx4)" }}>{post.dept}</span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>·</span>
          <span style={{ fontSize: "var(--t-caption)", color: "var(--tx4)" }}>{post.days}d ago</span>
        </div>

        <div style={{
          fontSize: "var(--t-body)",
          color: "var(--tx3)",
          lineHeight: 1.7,
          marginTop: 14,
        }}>
          {post.body.length > 180 ? `${post.body.slice(0, 180)}...` : post.body}
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 18,
          flexWrap: "wrap",
        }}>
          {post.desire && (
            <span style={{
              fontSize: "var(--t-caption)",
              color: isComplete ? "var(--green)" : "var(--gold)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <Sparkles size={12} />D.E.S.I.R.E. {filledFields}/6
            </span>
          )}
          <span style={{
            fontSize: "var(--t-caption)",
            color: "var(--tx3)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            <MessageSquare size={12} />{post.riffs.length} {post.riffs.length === 1 ? "riff" : "riffs"}
          </span>
          {post.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <div style={{
          padding: "3px 8px",
          background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${meta.color} 30%, transparent)`,
          fontSize: "var(--t-micro)",
          fontWeight: 700,
          letterSpacing: 1.5,
          color: meta.color,
          textAlign: "center",
          borderRadius: 2,
        }}>
          {meta.label}
        </div>
      </div>
    </div>
  );
}

const voteBtn = {
  padding: 4,
  color: "var(--tx4)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 200,
  padding: 20,
};

function StoryDetailModal({ postId, onClose }) {
  const p = STORY_POSTS.find(x => x.id === postId);
  if (!p) return null;
  const filledFields = p.desire ? Object.values(p.desire).filter(v => v && v.trim()).length : 0;
  const allFilled = filledFields === 6;
  const blankFields = p.desire
    ? DESIRE_FIELDS.filter(f => !p.desire[f] || !p.desire[f].trim())
    : DESIRE_FIELDS;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        onClick={ev => ev.stopPropagation()}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          maxWidth: 780,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          color: "var(--tx)",
        }}
      >
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {p.types.map(tid => {
              const t = ENTRY_TYPES.find(x => x.id === tid);
              return (
                <span key={tid} style={{
                  padding: "3px 9px",
                  background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                  color: t.color,
                  fontSize: "var(--t-micro)",
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderRadius: 2,
                }}>
                  {tid}
                </span>
              );
            })}
            {p.loved && (
              <span style={{
                padding: "3px 10px",
                background: "var(--green)",
                color: "#000",
                fontSize: "var(--t-micro)",
                fontWeight: 800,
                letterSpacing: 1.5,
                borderRadius: 2,
              }}>
                LOVED
              </span>
            )}
            {p.brandFlag && (
              <span style={{
                padding: "3px 10px",
                background: "rgba(249,115,22,0.15)",
                color: "#f97316",
                fontSize: "var(--t-micro)",
                fontWeight: 700,
                borderRadius: 2,
              }}>
                {p.brandFlag}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ color: "var(--tx4)", padding: 4, background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ overflow: "auto", flex: 1 }}>
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "flex-start",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--t-h2)", fontWeight: 800, lineHeight: 1.3 }}>
                  {p.title}
                </div>
                <div style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 6,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    background: "var(--bg3)",
                    border: "1px solid var(--bdr)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "var(--tx3)" }}>
                      {p.avatar}
                    </span>
                  </div>
                  <span style={{ fontSize: "var(--t-caption)", fontWeight: 700 }}>{p.author}</span>
                  <span style={{ fontSize: "var(--t-caption)", color: "var(--tx4)" }}>{p.dept}</span>
                  <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>· {p.days}d ago</span>
                </div>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                minWidth: 60,
              }}>
                <button style={voteBtn}><ArrowUp size={18} /></button>
                <span style={{
                  fontSize: "var(--t-h2)",
                  fontWeight: 900,
                  color: "var(--gold)",
                }}>
                  {p.votes}
                </span>
                <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>VOTES</span>
              </div>
            </div>

            <div style={{
              fontSize: "var(--t-body)",
              color: "var(--tx2)",
              lineHeight: 1.7,
              marginTop: 14,
            }}>
              {p.body}
            </div>

            {p.tags.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {p.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            )}

            {p.aiNote && (
              <div style={{
                marginTop: 14,
                padding: 12,
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 2,
              }}>
                <div style={{
                  fontSize: "var(--t-caption)",
                  fontWeight: 700,
                  color: "#f97316",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <Sparkles size={12} />GESTALT INTELLIGENCE — BRAND CHECK
                </div>
                <div style={{
                  fontSize: "var(--t-caption)",
                  color: "var(--tx2)",
                  lineHeight: 1.6,
                }}>
                  {p.aiNote}
                </div>
              </div>
            )}
          </div>

          {p.desire && (
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{
                padding: 16,
                background: "var(--bg3)",
                border: "1px solid var(--bdr)",
                borderRadius: 2,
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}>
                  <div>
                    <div style={{
                      fontSize: "var(--t-caption)",
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: "var(--gold)",
                    }}>
                      D.E.S.I.R.E. — STRUCTURED RESOLUTION
                    </div>
                    <div style={{
                      fontSize: "var(--t-micro)",
                      color: "var(--tx4)",
                      marginTop: 2,
                    }}>
                      {filledFields}/6 fields complete
                      {allFilled
                        ? " — LOVED"
                        : blankFields.length > 0
                          ? ` — ${blankFields.length} field${blankFields.length === 1 ? "" : "s"} open for RIFF`
                          : ""}
                    </div>
                  </div>
                  {allFilled && (
                    <span style={{
                      padding: "4px 10px",
                      background: "var(--green)",
                      color: "#000",
                      fontSize: "var(--t-caption)",
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      borderRadius: 2,
                    }}>
                      LOVED
                    </span>
                  )}
                </div>

                {DESIRE_FIELDS.map(f => {
                  const filled = p.desire[f] && p.desire[f].trim();
                  return (
                    <div key={f} style={{ marginBottom: 10 }}>
                      <div style={{
                        fontSize: "var(--t-caption)",
                        fontWeight: 800,
                        letterSpacing: 1,
                        color: filled ? "var(--gold)" : "var(--tx5)",
                        marginBottom: 3,
                      }}>
                        {f.toUpperCase()}{" "}
                        <span style={{ fontWeight: 400, color: "var(--tx5)" }}>
                          — {DESIRE_HINTS[f]}
                        </span>
                      </div>
                      <div style={{
                        fontSize: "var(--t-body)",
                        color: filled ? "var(--tx2)" : "var(--tx5)",
                        lineHeight: 1.6,
                        fontStyle: filled ? "normal" : "italic",
                        padding: "8px 12px",
                        background: filled ? "var(--bg2)" : "transparent",
                        border: `1px dashed ${filled ? "var(--bdr)" : "var(--bdr2)"}`,
                        borderRadius: 2,
                      }}>
                        {filled ? p.desire[f] : "Open for RIFF — your team can complete this field"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ padding: "0 20px 14px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}>
              <div style={{
                fontSize: "var(--t-caption)",
                fontWeight: 800,
                letterSpacing: 2,
                color: "var(--tx3)",
              }}>
                RIFFS — {p.riffs.length}
              </div>
              <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>
                Threaded · Best sort · Depth 2
              </span>
            </div>
            {p.riffs.length === 0 ? (
              <div style={{
                padding: 20,
                textAlign: "center",
                color: "var(--tx4)",
                fontSize: "var(--t-caption)",
                background: "var(--bg3)",
                border: "1px dashed var(--bdr2)",
                borderRadius: 2,
              }}>
                No RIFFs yet. Be the first to refine, fill a missing field, or react.
              </div>
            ) : (
              p.riffs.map(r => <RiffRow key={r.id} riff={r} />)
            )}
          </div>

          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--bdr)",
            background: "var(--bg2)",
          }}>
            <div style={{
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              color: "var(--tx3)",
              marginBottom: 6,
            }}>
              ADD A RIFF
            </div>
            <textarea
              className="gold-input"
              placeholder="Refine, fill a missing D.E.S.I.R.E. field, encourage, or push back..."
              style={{
                width: "100%",
                minHeight: 70,
                padding: "10px 12px",
                background: "var(--inp)",
                border: "1px solid var(--bdr)",
                borderRadius: 2,
                outline: "none",
                resize: "vertical",
                fontSize: "var(--t-body)",
                lineHeight: 1.55,
                color: "var(--tx)",
                fontFamily: "inherit",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              flexWrap: "wrap",
              gap: 8,
            }}>
              <div style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>
                PARTICIPATION LOGGED — GESTALT INTELLIGENCE classifies depth.
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{
                  padding: "6px 12px",
                  border: "1px solid var(--bdr2)",
                  background: "transparent",
                  color: "var(--tx3)",
                  borderRadius: 2,
                  fontSize: "var(--t-micro)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}>
                  SAVE TO MY JOURNAL
                </button>
                <button style={{
                  padding: "6px 14px",
                  background: "var(--gold)",
                  color: "#000",
                  border: "none",
                  borderRadius: 2,
                  fontSize: "var(--t-caption)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}>
                  POST RIFF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RIFF_TYPE_META = {
  "field-completion": { label: "FILLED MISSING FIELD", color: "var(--green)" },
  refinement:         { label: "REFINEMENT",           color: "var(--blue)"  },
  encouragement:      { label: "ENCOURAGEMENT",        color: "var(--gold)"  },
};

function RiffRow({ riff }) {
  const meta = RIFF_TYPE_META[riff.contributionType]
            || { label: riff.contributionType, color: "var(--tx3)" };
  return (
    <div style={{
      padding: "12px 14px",
      background: "var(--bg3)",
      border: "1px solid var(--bdr)",
      borderRadius: 2,
      marginBottom: 6,
      display: "flex",
      gap: 12,
    }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 30,
        }}
      >
        <button style={voteBtn}><ArrowUp size={13} /></button>
        <span style={{
          fontSize: "var(--t-caption)",
          fontWeight: 800,
          color: "var(--tx2)",
        }}>
          {riff.votes}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <div style={{
            width: 22,
            height: 22,
            background: "var(--bg)",
            border: "1px solid var(--bdr)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "var(--tx3)" }}>
              {riff.avatar}
            </span>
          </div>
          <span style={{ fontSize: "var(--t-caption)", fontWeight: 700 }}>{riff.author}</span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>{riff.days}d ago</span>
          <span style={{
            padding: "1px 6px",
            background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
            color: meta.color,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: 2,
          }}>
            {meta.label}
          </span>
          {riff.fieldFilled && (
            <span style={{
              padding: "1px 6px",
              background: "rgba(95,204,0,0.15)",
              color: "var(--green)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              borderRadius: 2,
            }}>
              {riff.fieldFilled.toUpperCase()}
            </span>
          )}
          <span style={{
            marginLeft: "auto",
            padding: "1px 6px",
            background: "rgba(95,204,0,0.15)",
            color: "var(--green)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: 2,
          }}>
            PARTICIPATION LOGGED
          </span>
        </div>
        <div style={{
          fontSize: "var(--t-body)",
          color: "var(--tx2)",
          lineHeight: 1.6,
          marginTop: 6,
        }}>
          {riff.body}
        </div>
      </div>
    </div>
  );
}
