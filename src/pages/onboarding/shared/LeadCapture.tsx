import { useState } from "react";

export type Lead = { firstName: string; lastName: string; companyName: string; email: string };

export function LeadCapture({ onSubmit }: { onSubmit: (lead: Lead) => void }) {
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [companyName, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const valid = firstName.trim() && lastName.trim() && companyName.trim() && validEmail;

  const submit = () => valid && onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), companyName: companyName.trim(), email: email.trim() });

  return (
    <div className="ob-lead">
      <div className="ob-label">ALWAYS FREE · FRAMEWORK · 21-POINT ASSESSMENT</div>
      <h2 className="ob-lead-h2">Uncover your blindspots in 3 minutes.</h2>
      <p className="ob-lead-sub">No credit card. No commitment. Just the questions and the stats.</p>
      <form className="ob-lead-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="ob-lead-row">
          <input value={firstName} onChange={(e) => setFirst(e.target.value)} placeholder="First name" autoFocus />
          <input value={lastName} onChange={(e) => setLast(e.target.value)} placeholder="Last name" />
        </div>
        <input value={companyName} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" type="email" />
        <button type="submit" className="ob-lead-submit" disabled={!valid}>BEGIN ASSESSMENT →</button>
      </form>
    </div>
  );
}
