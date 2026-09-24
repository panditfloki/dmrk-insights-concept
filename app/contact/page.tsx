import { getPublishedContent } from '@/lib/published-content';
export const dynamic = "force-dynamic";
import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata() { return pageMetadata('contact'); }

export default async function ContactPage() {
  const {site, page, copy} = await getWebsitePage('contact');
  const allItems = await getPublishedContent();
  const industries = siteIndustries(site).map(s=>s.name);
  const sectors = siteIndustries(site);
  const services = siteServices(site);
  const method = siteMethod(site);
  const REGIONS = settingsCopy(site)('regions');
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{copy("text_1", "Let's connect") }</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "20ch" }}>{copy("text_2", "Tell us the decision you need to make.") }</h1>
          <p className="lede">{copy("text_3", "Share your research or consulting requirement and a DMRK Insights specialist will help shape the right approach.") }</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="article-layout">
            <ContactForm />
            <aside>
              <div className="aside-card">
                <h3>{copy("text_4", "DMRK Insights") }</h3>
                <dl>
                  {settingsCopy(site)("email")&&<div><dt>Email</dt><dd><a href={`mailto:${settingsCopy(site)("email")}`}>{settingsCopy(site)("email")}</a></dd></div>}
                  {settingsCopy(site)("phone")&&<div><dt>Phone</dt><dd>{settingsCopy(site)("phone")}</dd></div>}
                  {settingsCopy(site)("address")&&<div><dt>Address</dt><dd>{settingsCopy(site)("address")}</dd></div>}
                  <div><dt>{copy("text_5", "Coverage") }</dt><dd style={{ fontWeight: 500, lineHeight: 1.5 }}>{REGIONS}</dd></div>
                  <div><dt>{copy("text_6", "Sectors") }</dt><dd>{industries.length}</dd></div>
                  <div><dt>{copy("text_7", "Published pieces") }</dt><dd>{allItems.length}</dd></div>
                </dl>
                <div className="divider" />
                <p style={{ color: "var(--muted)", fontSize: "var(--step--1)", lineHeight: 1.55 }}>{copy("text_8", "Market research and strategic consulting support across") }{" "}{REGIONS}.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
