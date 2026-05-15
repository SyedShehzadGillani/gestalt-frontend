import type { VaultDocument } from "@/data/vault-types";

interface Props {
  doc: VaultDocument;
}

function KV({ label, value }: { label: string; value: string | number }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

interface CompetitorLike {
  name?: string;
  color?: string;
  narrative?: string;
  evidence?: string;
  threat?: number;
}

function CompetitorRow({ c }: { c: CompetitorLike }) {
  return (
    <div className="vault-competitor-row">
      <div className="vault-competitor-swatch" style={{ background: c.color ?? "#888" }} />
      <div>
        <div style={{ fontWeight: 600 }}>{c.name}</div>
        <div style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
          {c.narrative ?? c.evidence ?? ""}
        </div>
        {c.threat !== undefined && (
          <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
            Threat score: {c.threat}
          </div>
        )}
      </div>
    </div>
  );
}

function renderCompetitiveLandscape(data: Record<string, unknown>) {
  const wx = data.word_exercise as
    | { selected_words?: string[]; priority_6?: string[]; manifesto_text?: string; manifesto_version?: number }
    | undefined;
  const comp = data.competitors as
    | { known?: CompetitorLike[]; surfaced?: CompetitorLike[] }
    | undefined;
  const spectrum = data.spectrum_placements as Record<string, Record<string, number>> | undefined;

  return (
    <>
      {wx && (
        <section className="vault-section-card">
          <h3>Word Exercise</h3>
          {wx.priority_6 && (
            <div className="vault-word-chips" style={{ marginBottom: 12 }}>
              {wx.priority_6.map((w) => (
                <span key={w} className="vault-word-chip">
                  {w}
                </span>
              ))}
            </div>
          )}
          {wx.manifesto_text && (
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>
              <strong>Manifesto v{wx.manifesto_version ?? 1}:</strong> {wx.manifesto_text}
            </p>
          )}
        </section>
      )}

      {comp && (
        <section className="vault-section-card">
          <h3>Competitors</h3>
          {comp.known && comp.known.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", margin: "4px 0 6px" }}>
                Known
              </div>
              {comp.known.map((c, i) => (
                <CompetitorRow key={`k-${i}`} c={c} />
              ))}
            </>
          )}
          {comp.surfaced && comp.surfaced.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", margin: "10px 0 6px" }}>
                AI-surfaced
              </div>
              {comp.surfaced.map((c, i) => (
                <CompetitorRow key={`s-${i}`} c={c} />
              ))}
            </>
          )}
        </section>
      )}

      {spectrum && (
        <section className="vault-section-card">
          <h3>Spectrum Placements</h3>
          {Object.entries(spectrum).map(([axis, placements]) => (
            <div key={axis} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, textTransform: "capitalize" }}>
                {axis.replace(/_/g, " ")}
              </div>
              <dl className="vault-kv">
                {Object.entries(placements).map(([k, v]) => (
                  <KV key={k} label={k} value={v} />
                ))}
              </dl>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function renderGeneric(doc: VaultDocument) {
  return (
    <section className="vault-section-card">
      <h3>{doc.module} · {doc.section}</h3>
      <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>
        Module-specific renderer pending. Raw archive payload shown below.
      </p>
      <pre>{JSON.stringify(doc.data, null, 2)}</pre>
    </section>
  );
}

export function VaultDocumentRenderer({ doc }: Props) {
  if (doc.module === "FORMULA" && doc.section_code === "01.10") {
    return renderCompetitiveLandscape(doc.data);
  }
  return renderGeneric(doc);
}
