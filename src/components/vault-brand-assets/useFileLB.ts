import { useState } from "react";
import type { MediaItem } from "./media-types";

export function useFileLB() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [idx, setIdx] = useState(0);

  const open = (newItems: MediaItem[], i: number) => {
    setItems(newItems);
    setIdx(i);
  };

  const close = () => setItems(null);

  return { items, idx, open, close, setIdx };
}
