import type { MediaItem } from "./media-types";
import { Thumb } from "./Thumb";
import { useFileLB } from "./useFileLB";
import { FileLB } from "./FileLB";
import { APPLICATION_NAMES } from "./data/section-data";

const APP_ITEMS: MediaItem[] = APPLICATION_NAMES.map((n) => ({
  name: n,
  type: "document",
  fmts: ["PDF", "PNG"],
  category: "APPLICATIONS",
  sub: "Template",
}));

export function ApplicationsSection() {
  const lb = useFileLB();

  return (
    <>
      <div className="vb-thumb-row vb-thumb-wrap">
        {APP_ITEMS.map((item, i) => (
          <Thumb
            key={item.name}
            name={item.name}
            fmts={item.fmts}
            sub={item.sub}
            onOpen={() => lb.open(APP_ITEMS, i)}
          />
        ))}
      </div>
      <div className="vb-dlbar">
        <span className="vb-dlbar-meta">v1.0 · 2025-11-10</span>
      </div>
      {lb.items && (
        <FileLB items={lb.items} idx={lb.idx} onClose={lb.close} onNav={lb.setIdx} />
      )}
    </>
  );
}
