import { useState, type ReactNode } from "react";
import { Download, Sun, Moon, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { VAULT_SECTIONS } from "./nav-config";
import { UploadBtn } from "./UploadBtn";
import { TagBar } from "./TagBar";
import { FavoritesBar } from "./FavoritesBar";
import "./vault-brand.css";

type Props = {
  children: ReactNode;
};

export function VaultBrandLayout({ children }: Props) {
  const [activeId, setActiveId] = useState<string>("dashboard");

  const scrollTo = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(`vb-sec-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
  };

  return (
    <div className="vault-brand-scope">
      <nav className="vb-nav">
        <div className="vb-nav-header">
          <div className="vb-nav-eyebrow">S.U.M.</div>
          <div className="vb-nav-title">VAULT</div>
          <div className="vb-nav-sub">Brand Assets</div>
        </div>
        <div className="vb-storage">
          <div className="vb-storage-row">
            <span className="vb-storage-label">STORAGE</span>
            <span className="vb-storage-value">3.2 / 10 GB</span>
          </div>
          <div className="vb-storage-track">
            <div className="vb-storage-fill" style={{ width: "32%" }} />
          </div>
        </div>
        <div className="vb-nav-list">
          {VAULT_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`vb-nav-link${activeId === s.id ? " is-active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ padding: 10, borderTop: "1px solid var(--vb-border)" }}>
          <button type="button" className="vb-textbtn" onClick={toggleTheme}>
            <Sun size={12} />
            <Moon size={12} />
            TOGGLE THEME
          </button>
        </div>
      </nav>

      <div className="vb-main">
        <header className="vb-header">
          <div className="vb-header-row">
            <div>
              <h1 className="vb-title">Identity Guidelines</h1>
              <p className="vb-subtitle">Master the system. Protect the brand.</p>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <UploadBtn />
              <button type="button" className="vb-textbtn">
                <Download size={14} /> Download Media Kit
              </button>
            </div>
          </div>
          <div className="vb-search">
            <span className="vb-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input placeholder="Search assets, campaigns, tags..." />
          </div>
        </header>

        <TagBar />
        <FavoritesBar />

        <div className="vb-content">{children}</div>

        <div className="vb-footer">
          <span>© 2026 — VAULT — GESTALT INTELLIGENCE</span>
          <span>All assets protected by brand governance policy</span>
        </div>
      </div>
    </div>
  );
}

type SectionProps = {
  id: string;
  title: string;
  defaultClosed?: boolean;
  children?: ReactNode;
};

export function VaultBrandSection({ id, title, defaultClosed, children }: SectionProps) {
  const [open, setOpen] = useState(!defaultClosed);
  return (
    <section id={`vb-sec-${id}`} className={`vb-section${open ? "" : " is-closed"}`}>
      <div className="vb-section-head" onClick={() => setOpen((v) => !v)} role="button" tabIndex={0}>
        <h2 className="vb-section-title">{title}</h2>
        <div style={{ display: "flex", gap: 2 }}>
          <button
            type="button"
            className="vb-iconbtn"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Add to ${title}`}
          >
            <Pencil size={14} />
          </button>
          <button type="button" className="vb-iconbtn" aria-label={open ? "Collapse" : "Expand"}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
      {open && <div className="vb-section-body">{children}</div>}
    </section>
  );
}
