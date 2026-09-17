import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { REGIONS } from "@/lib/site";
import { industries, allItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us the decision you need to make.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Let&apos;s connect</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "20ch" }}>Tell us the decision you need to make.</h1>
          <p className="lede">
            Share your research or consulting requirement and a DMRK Insights specialist will help
            shape the right approach.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="article-layout">
            <ContactForm />
            <aside>
              <div className="aside-card">
                <h3>DMRK Insights</h3>
                <dl>
                  <div><dt>Coverage</dt><dd style={{ fontWeight: 500, lineHeight: 1.5 }}>{REGIONS}</dd></div>
                  <div><dt>Sectors</dt><dd>{industries.length}</dd></div>
                  <div><dt>Published pieces</dt><dd>{allItems.length}</dd></div>
                </dl>
                <div className="divider" />
                <p style={{ color: "var(--muted)", fontSize: "var(--step--1)", lineHeight: 1.55 }}>
                  Market research and strategic consulting support across {REGIONS}.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
