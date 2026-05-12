// SVG icons mirroring the HTML mockup's I() helper. Stroke-based, currentColor.
import { CSSProperties } from "react";

const stroke = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

const paths: Record<string, JSX.Element> = {
  hash: (<><line x1="4" y1="9" x2="20" y2="9" {...stroke} /><line x1="4" y1="15" x2="20" y2="15" {...stroke} /><line x1="10" y1="3" x2="8" y2="21" {...stroke} /><line x1="16" y1="3" x2="14" y2="21" {...stroke} /></>),
  lock: (<><rect x="3" y="11" width="18" height="11" {...stroke} /><path d="M7 11V7a5 5 0 0110 0v4" {...stroke} /></>),
  pin: (<path d="M12 17v5M9 10.76V6a2 2 0 012-2h2a2 2 0 012 2v4.76L18 14H6l3-3.24z" {...stroke} />),
  plus: (<><line x1="12" y1="5" x2="12" y2="19" {...stroke} /><line x1="5" y1="12" x2="19" y2="12" {...stroke} /></>),
  folder: (<path d="M22 19V8a2 2 0 00-2-2h-7l-2-2H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2z" {...stroke} />),
  search: (<><circle cx="11" cy="11" r="8" {...stroke} /><line x1="21" y1="21" x2="16.65" y2="16.65" {...stroke} /></>),
  send: (<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" {...stroke} />),
  star: (<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" {...stroke} />),
  starFill: (<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />),
  bookmark: (<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" {...stroke} />),
  msg: (<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...stroke} />),
  bulb: (<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" {...stroke} />),
  book: (<><path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...stroke} /><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" {...stroke} /></>),
  poll: (<path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth={3} strokeLinecap="round" fill="none" />),
  chart: (<path d="M18 20V10M12 20V4M6 20v-6" {...stroke} />),
  play: (<polygon points="5,3 19,12 5,21" fill="currentColor" />),
  sticky: (<><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h10l6-6V5a2 2 0 00-2-2z" {...stroke} /><path d="M15 21v-6h6" {...stroke} /></>),
  heart: (<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...stroke} />),
  flame: (<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" {...stroke} />),
  check: (<polyline points="20 6 9 17 4 12" {...stroke} />),
  eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...stroke} /><circle cx="12" cy="12" r="3" {...stroke} /></>),
  smile: (<><circle cx="12" cy="12" r="10" {...stroke} /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" {...stroke} /></>),
  alert: (<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...stroke} /><line x1="12" y1="9" x2="12" y2="13" {...stroke} /><line x1="12" y1="17" x2="12.01" y2="17" {...stroke} /></>),
  users: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" {...stroke} /><circle cx="9" cy="7" r="4" {...stroke} /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" {...stroke} /></>),
  up: (<path d="M12 19V5M5 12l7-7 7 7" {...stroke} />),
  clock: (<><circle cx="12" cy="12" r="10" {...stroke} /><path d="M12 6v6l4 2" {...stroke} /></>),
  crown: (<path d="M2 18h20l-3-12-5 4-4-7-4 7-5-4z" {...stroke} />),
  sparkles: (<><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" {...stroke} /><path d="M19 17l.6 1.8L21 19.5l-1.4.7L19 22l-.6-1.8L17 19.5l1.4-.7z" {...stroke} /></>),
  paperclip: (<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" {...stroke} />),
  at: (<><circle cx="12" cy="12" r="4" {...stroke} /><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" {...stroke} /></>),
  bold: (<path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" {...stroke} />),
  italic: (<><line x1="19" y1="4" x2="10" y2="4" {...stroke} /><line x1="14" y1="20" x2="5" y2="20" {...stroke} /><line x1="15" y1="4" x2="9" y2="20" {...stroke} /></>),
  underline: (<><path d="M6 3v7a6 6 0 0012 0V3M4 21h16" {...stroke} /></>),
  link: (<><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" {...stroke} /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" {...stroke} /></>),
  listUl: (<><line x1="8" y1="6" x2="21" y2="6" {...stroke} /><line x1="8" y1="12" x2="21" y2="12" {...stroke} /><line x1="8" y1="18" x2="21" y2="18" {...stroke} /><line x1="3" y1="6" x2="3.01" y2="6" {...stroke} /><line x1="3" y1="12" x2="3.01" y2="12" {...stroke} /><line x1="3" y1="18" x2="3.01" y2="18" {...stroke} /></>),
  listOl: (<><line x1="10" y1="6" x2="21" y2="6" {...stroke} /><line x1="10" y1="12" x2="21" y2="12" {...stroke} /><line x1="10" y1="18" x2="21" y2="18" {...stroke} /><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" {...stroke} /></>),
  code: (<><polyline points="16 18 22 12 16 6" {...stroke} /><polyline points="8 6 2 12 8 18" {...stroke} /></>),
  type: (<><polyline points="4 7 4 4 20 4 20 7" {...stroke} /><line x1="9" y1="20" x2="15" y2="20" {...stroke} /><line x1="12" y1="4" x2="12" y2="20" {...stroke} /></>),
  x: (<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />),
};

export interface IconProps { name: string; size?: number; color?: string; style?: CSSProperties; }
export function Icon({ name, size = 16, color, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0, color, ...style }}>
      {paths[name] ?? null}
    </svg>
  );
}
