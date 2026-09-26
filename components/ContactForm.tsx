"use client";
import ThemeSelect from "./ThemeSelect";
import { useWebsite } from '@/components/WebsiteProvider';
import { pageCopy, siteServices } from '@/lib/website-shared';

import { useState } from "react";
import { Arrow } from "./Icons";

export default function ContactForm() {
  const site = useWebsite();
  const copy = pageCopy(site.pages.find(p=>p.key==='contact-form'));
  const services = siteServices(site);
  const [sent, setSent] = useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setError('');setSent(false);
        const form=e.currentTarget;
        try {
          const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
          if(!response.ok)throw new Error('Unable to save your enquiry. Check the fields and try again.');
          setSent(true);form.reset();
        }catch(error){setError(error instanceof Error?error.message:'Unable to save your enquiry.');}
        finally{setBusy(false);}
      }}
    >
      {sent && <p className="form-note" role="status">Your enquiry has been received.</p>}
      {error && <p className="form-note" role="alert">{error}</p>}
      <div hidden><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="field-row">
        <label className="field">
          <span>{copy("text_3", "Full name") }</span>
          <input name="name" required autoComplete="name" placeholder={copy("text_4", "Your name")} />
        </label>
        <label className="field">
          <span>{copy("text_5", "Work email") }</span>
          <input name="email" type="email" required autoComplete="email" placeholder={copy("text_6", "you@company.com")} />
        </label>
      </div>

      <label className="field">
        <span>{copy("text_7", "Company") }</span>
        <input name="company" autoComplete="organization" placeholder={copy("text_8", "Company name")} />
      </label>

      <ThemeSelect name="service" label={copy("text_11", "What do you need?")} placeholder={copy("text_12", "Select a service")} options={[...services.map(s=>({value:s.slug,label:s.name})),{value:'other',label:copy("text_13", "Something else")}]} />

      <label className="field">
        <span>{copy("text_14", "The decision you need to make") }</span>
        <textarea name="brief" rows={5} required minLength={10} maxLength={10000} placeholder={copy("text_15", "e.g. Should we enter the Pune market next year, and through which channel?")} />
      </label>

      <button className="button" type="submit" disabled={busy}>{copy("text_16", "Send enquiry") }{" "}<Arrow /></button>
    </form>
  );
}
