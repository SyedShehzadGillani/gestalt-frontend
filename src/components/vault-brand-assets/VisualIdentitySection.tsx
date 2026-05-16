import type { MediaItem } from "./media-types";
import { Thumb } from "./Thumb";
import { useFileLB } from "./useFileLB";
import { FileLB } from "./FileLB";
import { LOGOS } from "./data/section-data";

function makeItems(grp: (typeof LOGOS)[number]): MediaItem[] {
  return grp.items.map((n) => ({
    name: n,
    type: "document" as const,
    fmts: ["SVG", "PNG", "PDF", "EPS"],
    category: grp.title,
    sub: grp.title,
  }));
}

export function VisualIdentitySection() {
  const lb = useFileLB();

  return (
    <>
      {LOGOS.map((grp) => {
        const grpItems = makeItems(grp);
        return (
          <div key={grp.title} className="vb-identity-group">
            <div className="vb-identity-group-title">{grp.title}</div>
            <div className="vb-thumb-row">
              {grpItems.map((item, i) => (
                <Thumb
                  key={item.name}
                  name={item.name}
                  fmts={item.fmts}
                  onOpen={() => lb.open(grpItems, i)}
                />
              ))}
            </div>
            <div className="vb-dlbar">
              <span className="vb-dlbar-meta">{grp.v} · {grp.d}</span>
            </div>
          </div>
        );
      })}
      {lb.items && (
        <FileLB items={lb.items} idx={lb.idx} onClose={lb.close} onNav={lb.setIdx} />
      )}
    </>
  );
}
