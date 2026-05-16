export type MediaKind = "document" | "photo" | "video" | "motion";

export type MediaItem = {
  name: string;
  type: MediaKind;
  fmts?: string[];
  category?: string;
  sub?: string;
  duration?: string;
  height?: number;
  tag?: string;
  platform?: string;
};
