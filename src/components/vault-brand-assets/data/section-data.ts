export const LOGOS = [
  { title: "BRAND MARK", v: "v1.2", d: "2025-11-15", items: ["PRIMARY", "REVERSED", "MONOCHROME", "KNOCKOUT", "MINIMAL", "ICON ONLY"] },
  { title: "LOGO", v: "v1.0", d: "2025-11-01", items: ["PRIMARY", "REVERSED", "MONOCHROME", "STACKED", "LIGHT BG", "DARK BG", "GRAYSCALE"] },
  { title: "LOGOTYPE", v: "v1.1", d: "2025-11-16", items: ["PRIMARY", "LIGHT", "REVERSED", "MONOCHROME"] },
  { title: "SUB LOGO", v: "v1.0", d: "2025-11-02", items: ["DIVISION A", "DIVISION B", "PRODUCT", "TAGLINE", "EVENT"] },
  { title: "FAVICON & APP ICONS", v: "v1.0", d: "2025-11-15", items: ["16px", "32px", "48px", "192px", "512px", "SOCIAL"] },
];

export const USAGE_RULES = [
  { t: "CLEAR SPACE", d: "Minimum padding equal to brandmark height on all sides." },
  { t: "MINIMUM SIZE", d: "Digital: 120px horizontal, 80px stacked. Print: 1.5in / 1in." },
  { t: "BACKGROUND CONTROL", d: "Solid backgrounds only. On photography, use a container." },
  { t: "CONTRAST RULES", d: "Reversed on dark, standard on light. 4.5:1 minimum." },
  { t: "INCORRECT USAGE", d: "No rotate, stretch, effects, outline, recolor, crop, shadow." },
  { t: "VENDOR RULES", d: "Vendor Usage Guide only. No modifications." },
  { t: "PRINT vs DIGITAL", d: "Print: CMYK (EPS/PDF). Digital: RGB (SVG/PNG)." },
  { t: "EMBROIDERY / SIGNAGE", d: "One-color version. Vector only. 2x minimum sizes." },
];

export const GRAPHICS_CARDS = [
  "GRID SYSTEM", "SPACING RULES", "LAYOUT PRINCIPLES", "ICONOGRAPHY STYLE",
  "DATA VISUALIZATION", "MOTION PRINCIPLES", "BORDER RULES", "ILLUSTRATION DIRECTION",
];

export const ICON_NAMES = [
  "download", "edit", "search", "upload", "send",
  "eye", "folder", "file", "shield", "star",
  "bar", "image", "plus", "check",
];

export const APPLICATION_NAMES = [
  "Business Card", "Letterhead", "Envelope", "Email Signature", "Proposal",
  "Sales Deck", "Social Posts", "LinkedIn Banner", "Website", "Landing Page",
  "Digital Ads", "Lobby Signage", "Wayfinding Signs", "Exterior Signage", "Vehicle Graphics",
  "Apparel", "Trade Show Booth", "Event Banner", "Name Badge", "Packaging",
];

export const DIGITAL_ITEMS = [
  { n: "Website Logo", s: "Logo placement rules for header, footer, mobile", f: ["SVG", "PNG"] },
  { n: "Button Styles", s: "Primary, secondary, ghost, disabled states", f: ["PNG", "PDF"] },
  { n: "Form Styling", s: "Input fields, dropdowns, validation states", f: ["PNG", "PDF"] },
  { n: "CTA Language", s: "Button copy, link text, urgency patterns", f: ["PDF"] },
  { n: "Video Covers", s: "YouTube, Vimeo, Wistia thumbnail templates", f: ["PNG", "JPG"] },
  { n: "Email Signature", s: "HTML signature with logo, contact, social links", f: ["PNG", "PDF"] },
  { n: "Presentation Rules", s: "Slide master, section dividers, data layouts", f: ["PDF", "PNG"] },
  { n: "Responsive Rules", s: "Breakpoints, mobile-first layouts, touch targets", f: ["PNG", "PDF"] },
  { n: "Dark Mode Rules", s: "Color inversions, contrast adjustments, logo swaps", f: ["PNG", "PDF"] },
];

export const SOCIAL_ITEMS = [
  { n: "Instagram Profile", p: "INSTAGRAM", f: ["PNG", "JPG"] },
  { n: "Instagram Story", p: "INSTAGRAM", f: ["PNG"] },
  { n: "Facebook Cover", p: "FACEBOOK", f: ["PNG", "JPG"] },
  { n: "Facebook Profile", p: "FACEBOOK", f: ["PNG"] },
  { n: "LinkedIn Banner", p: "LINKEDIN", f: ["PNG", "JPG"] },
  { n: "LinkedIn Profile", p: "LINKEDIN", f: ["PNG"] },
  { n: "X / Twitter Header", p: "X", f: ["PNG", "JPG"] },
  { n: "X / Twitter Profile", p: "X", f: ["PNG"] },
  { n: "TikTok Profile", p: "TIKTOK", f: ["PNG"] },
  { n: "Threads Profile", p: "THREADS", f: ["PNG"] },
  { n: "YouTube Banner", p: "YOUTUBE", f: ["PNG", "JPG"] },
  { n: "YouTube Profile", p: "YOUTUBE", f: ["PNG"] },
];

export const GOVERNANCE_CARDS = [
  { t: "WHO APPROVES", d: "Brand owner or admin approves all external usage." },
  { t: "VENDOR RULES", d: "Vendors receive Usage Guide. No modifications." },
  { t: "FILE LOCATION", d: "All current files in VAULT. Single source of truth." },
  { t: "ARCHIVAL", d: "Superseded files archived with date. Never deleted." },
  { t: "MODIFICATION", d: "Written approval required for any change." },
  { t: "REQUESTS", d: "Submit through VAULT. 24hr standard, 48hr custom." },
];

export const NAMING_COMPONENTS = [
  { t: "LOGO TYPE", d: "Primary, Secondary, Wordmark, Brandmark, Badge, Tagline" },
  { t: "ORIENTATION", d: "Horizontal, Vertical, Stacked, Square" },
  { t: "COLOR MODE", d: "FullColor, OneColor, Black, White, Grayscale" },
  { t: "BACKGROUND", d: "Transparent, White, Dark, Color" },
  { t: "FILE USE", d: "Digital, Print, Social, Favicon, AppIcon, Source" },
  { t: "VERSION", d: "v01, v02, v03..." },
  { t: "EXTENSION", d: ".svg .pdf .png .eps .jpg .ico .ai" },
  { t: "EXAMPLE", d: "Acme_Primary_Horizontal_FullColor_Transparent_Digital_v01.png" },
];

export const FORMAT_CARDS = [
  { t: "SVG", d: "Web, digital, responsive. Infinite scale." },
  { t: "PDF", d: "Print, sharing. Universal." },
  { t: "PNG", d: "Web, social. Transparency. Raster." },
  { t: "EPS", d: "Print production. Legacy vector." },
  { t: "JPG", d: "Photography. No transparency." },
  { t: "ICO", d: "Favicons only. Multi-resolution." },
  { t: "AI", d: "Source files. Never send to vendors." },
];

export const FOLDER_TREE = [
  "ClientName_BrandGuidelines_Package/",
  "├── 01_Brand_Guidelines/",
  "├── 02_Logos/",
  "│   ├── Primary/",
  "│   ├── Brandmark/",
  "│   └── Social/",
  "├── 03_Color/",
  "├── 04_Typography/",
  "├── 05_Templates/",
  "├── 06_Imagery/",
  "├── 07_Graphic_Elements/",
  "├── 08_Social_Media/",
  "├── 09_Web_Digital/",
  "└── 10_Read_Me/",
];

export const ASSET_INDEX_ROWS = [
  { n: "Primary Logo", d: "Default identifier", f: "SVG PDF PNG EPS", l: "02_Logos/Primary/" },
  { n: "Brandmark", d: "Standalone symbol", f: "SVG PNG ICO", l: "02_Logos/Brandmark/" },
  { n: "Social Icon", d: "Circle-crop", f: "SVG PNG JPG", l: "08_Social/" },
  { n: "Business Card", d: "3.5x2 template", f: "PDF EPS", l: "05_Templates/" },
  { n: "Color Reference", d: "All colors", f: "PDF PNG", l: "03_Color/" },
  { n: "Vendor Guide", d: "Simplified rules", f: "PDF", l: "01_Guidelines/" },
];

export const README_FAQS = [
  { t: "WHICH LOGO FIRST?", d: "Primary Logo — Horizontal." },
  { t: "FILES FOR WEB?", d: "SVG for logos. PNG for raster." },
  { t: "FILES FOR PRINT?", d: "PDF or EPS. CMYK and vector." },
  { t: "FILES FOR SOCIAL?", d: "Social Profile Icon for avatars." },
  { t: "SEND TO VENDORS?", d: "Vendor Usage Guide + specific files." },
  { t: "WHAT NOT TO DO?", d: "Never modify, recolor, rotate, stretch." },
  { t: "WHO TO CONTACT?", d: "Brand owner via VAULT." },
  { t: "FIND THE RIGHT FILE?", d: "File naming tells you instantly." },
];

export const CHECKLIST_ITEMS = [
  "All logos exported in SVG, PDF, PNG, EPS, JPG",
  "File naming convention applied",
  "Folder structure organized",
  "Color values documented",
  "Typography hierarchy defined",
  "Brand foundation completed",
  "Messaging system documented",
  "Logo usage rules defined",
  "Photography direction set",
  "Application templates designed",
  "Digital brand standards documented",
  "Brand governance established",
  "Vendor guide prepared",
  "Asset index complete",
  "READ ME FIRST written",
  "Package tested",
  "All files reviewed",
  "Shared to VAULT",
];
