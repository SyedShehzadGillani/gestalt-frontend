import { Download, Plus, X } from "lucide-react";
import { useState } from "react";
import { FONT_WEIGHTS } from "./data/color-data";

type Weight = { name: string; weight: number };
type Family = { id: string; name: string; weights: Weight[] };

const WEIGHT_PRESETS: Weight[] = [
  { name: "Thin", weight: 100 },
  { name: "Extra Light", weight: 200 },
  { name: "Light", weight: 300 },
  { name: "Regular", weight: 400 },
  { name: "Medium", weight: 500 },
  { name: "Semi Bold", weight: 600 },
  { name: "Bold", weight: 700 },
  { name: "Extra Bold", weight: 800 },
  { name: "Black", weight: 900 },
];

const uid = () => Math.random().toString(36).slice(2, 9);

export function TypographySection() {
  const [families, setFamilies] = useState<Family[]>([
    { id: uid(), name: "Gotham", weights: FONT_WEIGHTS as Weight[] },
  ]);

  const addFamily = () => {
    const name = window.prompt("Font family name?", "New Family")?.trim();
    if (!name) return;
    setFamilies((f) => [
      ...f,
      { id: uid(), name, weights: [{ name: "Regular", weight: 400 }] },
    ]);
  };

  const removeFamily = (id: string) =>
    setFamilies((f) => f.filter((x) => x.id !== id));

  const renameFamily = (id: string) => {
    const fam = families.find((x) => x.id === id);
    const name = window.prompt("Rename family", fam?.name)?.trim();
    if (!name) return;
    setFamilies((f) => f.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const removeWeight = (familyId: string, weight: number) =>
    setFamilies((f) =>
      f.map((x) =>
        x.id === familyId
          ? { ...x, weights: x.weights.filter((w) => w.weight !== weight) }
          : x,
      ),
    );

  const addWeight = (familyId: string, preset: Weight) =>
    setFamilies((f) =>
      f.map((x) =>
        x.id === familyId
          ? {
              ...x,
              weights: [...x.weights, preset].sort((a, b) => a.weight - b.weight),
            }
          : x,
      ),
    );

  return (
    <>
      {families.map((family) => {
        const used = new Set(family.weights.map((w) => w.weight));
        const available = WEIGHT_PRESETS.filter((p) => !used.has(p.weight));
        return (
          <div key={family.id} className="mb-16">
            <div className="flex items-start justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={() => renameFamily(family.id)}
                className="vb-typo-family font-extralight text-6xl text-left hover:opacity-80 transition"
                style={{ marginBottom: 0 }}
                title="Click to rename"
              >
                {family.name}
              </button>
              {families.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFamily(family.id)}
                  className="vb-textbtn"
                  title="Remove family"
                >
                  <X size={14} /> Remove family
                </button>
              )}
            </div>

            <div className="vb-typo-grid">
              {family.weights.map((fw) => (
                <div key={fw.weight} className="group relative">
                  <button
                    type="button"
                    onClick={() => removeWeight(family.id, fw.weight)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition bg-[var(--vb-t1)] text-[var(--vb-bg)] rounded-full w-6 h-6 flex items-center justify-center"
                    title={`Remove ${fw.name}`}
                  >
                    <X size={12} />
                  </button>
                  <div
                    className="vb-typo-weight-name"
                    style={{ fontWeight: fw.weight, fontFamily: family.name }}
                  >
                    {fw.name}
                  </div>
                  <div
                    className="vb-typo-sample"
                    style={{ fontWeight: fw.weight, fontFamily: family.name }}
                  >
                    AaBbDdEeGgMmOoRrSs
                  </div>
                  <div
                    className="vb-typo-sample"
                    style={{ fontWeight: fw.weight, fontFamily: family.name }}
                  >
                    1234567890 !?()[]{}@$#%
                  </div>
                  <div
                    className="vb-typo-sample dim"
                    style={{ fontWeight: fw.weight, fontFamily: family.name }}
                  >
                    AaBbDdEeGgMmOoRrSs
                  </div>
                  <div
                    className="vb-typo-sample dim"
                    style={{ fontWeight: fw.weight, fontFamily: family.name }}
                  >
                    1234567890 !?()[]{}@$#%
                  </div>
                </div>
              ))}
            </div>

            {available.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] tracking-[1.5px] font-semibold text-[var(--vb-t5)] self-center mr-2">
                  ADD WEIGHT
                </span>
                {available.map((p) => (
                  <button
                    key={p.weight}
                    type="button"
                    onClick={() => addWeight(family.id, p)}
                    className="vb-textbtn"
                  >
                    <Plus size={12} /> {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="vb-dlbar">
        <div className="vb-dlbar-meta">
          <span>VERSION v2.0</span>
          <span>UPDATED 2025-11-18</span>
          <span>{families.length} FAMILIES</span>
        </div>
        <div className="flex gap-3">
          <button type="button" className="vb-textbtn" onClick={addFamily}>
            <Plus size={14} /> Add Family
          </button>
          <button type="button" className="vb-textbtn">
            <Download size={14} /> Download All
          </button>
        </div>
      </div>
    </>
  );
}
