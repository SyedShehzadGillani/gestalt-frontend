import { useState } from "react";
import type { Lead } from "./LeadCapture";

export type Credentials = { username: string; password: string };

export function Paywall({ lead, blindspotCount, onUnlock }: { lead: Lead; blindspotCount: number; onUnlock: (c: Credentials) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const valid = username.trim().length >= 3 && password.length >= 6;

  return (
    <div className="ob-paywall">
      <div className="ob-label">FOUNDING PRICING</div>
      <h2 className="ob-paywall-h2">
        {lead.firstName} at {lead.companyName} — we found <span className="red">{blindspotCount} blindspots</span> draining your valuation.
      </h2>
      <p className="ob-paywall-sub">
        FRAMEWORK is yours, free, forever. To see the 100-point FOCUS deep dive — and get the daily VALUATION DRAIN report — unlock GESTALT PLATFORM.
      </p>

      <div className="ob-paywall-card">
        <div className="ob-paywall-card-tag">FOUNDING STANDARD</div>
        <div className="ob-paywall-card-title">GESTALT PLATFORM</div>
        <div className="ob-paywall-card-pillars">B.A.S.E. + H.I.V.E. + S.U.M.</div>
        <div className="ob-paywall-card-price">$797<span className="mo">/mo</span></div>
        <ul className="ob-paywall-list">
          <li>FRAMEWORK + FINANCIALS + FOCUS + FORMULA</li>
          <li>H.I.V.E. — 4-quadrant employee scoring</li>
          <li>S.U.M. — MESSAGING + JOURNAL + PROJECTS + VAULT</li>
          <li>EXIT EQUATION™ — live valuation tied to your score</li>
          <li>VALUATION DRAIN™ — daily dollar cost of every gap</li>
          <li>Bank-level encryption · Your data never trains AI</li>
        </ul>
      </div>

      <form className="ob-paywall-form" onSubmit={(e) => { e.preventDefault(); if (valid) onUnlock({ username: username.trim(), password }); }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" autoComplete="username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" type="password" autoComplete="new-password" />
        <button type="submit" className="ob-paywall-cta" disabled={!valid}>CLAIM FOUNDING RATE →</button>
      </form>
      <p className="ob-paywall-fine">30-Day Blind Spot Guarantee · Payment processing stub — Stripe integration pending.</p>
    </div>
  );
}
