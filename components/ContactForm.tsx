"use client";

import { useState } from "react";
import { Arrow } from "./Icons";
import { industries } from "@/lib/content";
import { services } from "@/lib/site";

/**
 * Concept-build form. It deliberately does NOT submit anywhere — there is no
 * backend on this engagement yet, and a form that silently swallows a real
 * enquiry is worse than one that says it is a demo.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent && (
        <p className="form-note" role="status">
          <strong>Demo only —</strong> nothing was sent. This concept build has no backend yet;
          wiring this form to a real inbox is part of the proposed scope.
        </p>
      )}

      <div className="field-row">
        <label className="field">
          <span>Full name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="field">
          <span>Work email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Company</span>
          <input name="company" autoComplete="organization" placeholder="Company name" />
        </label>
        <label className="field">
          <span>Sector</span>
          <select name="sector" defaultValue="">
            <option value="" disabled>Select a sector</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </div>

      <label className="field">
        <span>What do you need?</span>
        <select name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          <option value="other">Something else</option>
        </select>
      </label>

      <label className="field">
        <span>The decision you need to make</span>
        <textarea name="brief" rows={5} required placeholder="e.g. Should we enter the Pune market next year, and through which channel?" />
      </label>

      <button className="button" type="submit">Send enquiry <Arrow /></button>
    </form>
  );
}
