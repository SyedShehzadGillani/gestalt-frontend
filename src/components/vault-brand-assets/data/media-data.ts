import type { MediaItem } from "../media-types";

export const PHOTOGRAPHY: MediaItem[] = [
  { name: "Hero — Landscape", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Wide establishing shot. Natural light, warm tones.", height: 180, tag: "HERO" },
  { name: "Portrait — Team", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Individual or group. Authentic expressions.", height: 240, tag: "PORTRAIT" },
  { name: "Detail — Product", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Close-up on craftsmanship, texture, quality.", height: 160, tag: "DETAIL" },
  { name: "Environment — Space", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Office or workspace that represents the brand.", height: 200, tag: "ENVIRONMENT" },
  { name: "Candid — Culture", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Unposed moments showing team dynamics.", height: 180, tag: "CANDID" },
  { name: "Texture — Material", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Abstract textures that reinforce brand feel.", height: 220, tag: "TEXTURE" },
  { name: "Data — Dashboard", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Screenshots of data visualization and UI.", height: 170, tag: "DATA" },
  { name: "Event — Speaking", type: "photo", fmts: ["JPG", "PNG"], category: "PHOTOGRAPHY", sub: "Conference or presentation moments.", height: 190, tag: "EVENT" },
];

export const VIDEOS: MediaItem[] = [
  { name: "BRAND ANTHEM", type: "video", duration: "2:30", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Brand · 2:30" },
  { name: "PRODUCT DEMO", type: "video", duration: "4:15", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Product · 4:15" },
  { name: "FOUNDER STORY", type: "video", duration: "3:45", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Brand · 3:45" },
  { name: "TESTIMONIAL A", type: "video", duration: "1:30", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Proof · 1:30" },
  { name: "TESTIMONIAL B", type: "video", duration: "2:00", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Proof · 2:00" },
  { name: "EVENT REEL", type: "video", duration: "1:15", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Campaign · 1:15" },
  { name: "SOCIAL 15s", type: "video", duration: "0:15", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Social · 0:15" },
  { name: "SOCIAL 30s", type: "video", duration: "0:30", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Social · 0:30" },
  { name: "INVESTOR", type: "video", duration: "5:00", fmts: ["MP4", "MOV"], category: "VIDEO", sub: "Investor · 5:00" },
];

export type MotionAsset = { name: string; duration: string; subject: string; category: string };

export const MOTION_ASSETS: MotionAsset[] = [
  { name: "LOGO INTRO", duration: "3s", subject: "Primary logo reveal", category: "Logo" },
  { name: "LOGO LOOP", duration: "5s", subject: "Ambient logo animation", category: "Logo" },
  { name: "ICON TRANSITIONS", duration: "0.3s", subject: "Nav icon state changes", category: "Icon" },
  { name: "LOADING STATE", duration: "2s", subject: "Brand loading spinner", category: "UI" },
  { name: "PAGE TRANSITION", duration: "0.5s", subject: "Route change animation", category: "UI" },
  { name: "DATA REVEAL", duration: "0.8s", subject: "Chart/number animation", category: "Data" },
  { name: "BADGE ANIMATION", duration: "1.5s", subject: "Certified badge reveal", category: "Badge" },
  { name: "SOCIAL BUMPER", duration: "2s", subject: "Reel intro/outro", category: "Social" },
  { name: "EMAIL HEADER", duration: "3s", subject: "Animated email banner", category: "Email" },
];
