import { getPublishedContent } from '@/lib/published-content';
export const dynamic = "force-dynamic";
import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import Link from "@/components/WebsiteLink";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";

export async function generateMetadata() { return pageMetadata('services'); }

export default async function ServicesPage() {
  const {site, page, copy} = await getWebsitePage('services');
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
          <p className="eyebrow">{copy("text_1", "Services") }</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "22ch" }}>{copy("text_2", "Research-backed advisory for market, customer, and growth decisions.") }</h1>
          <p className="lede">{copy("text_3", "We help teams move from open questions to tested priorities through consulting, intelligence, primary research and expert access.") }</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            {services.slice(0,pageCount(site,'servicesCount',12)).map((s) => (
              <Reveal key={s.slug} group="svc">
                <article className="card" style={{ height: "100%" }}>
                  <div className="card-body">
                    <h3><Link href={`/services/${s.slug}`} className="stretched">{s.name}</Link></h3>
                    <p>{s.intro}</p>
                    <div className="card-foot">
                      <span className="textlink">{copy("text_4", "Explore") }{" "}<Arrow /></span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--wash">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_5", "How we work") }</Reveal>
              <Reveal as="h2">{copy("text_6", "Structured enough for rigor, flexible enough for real business questions.") }</Reveal>
            </div>
          </div>
          <div className="grid grid--4">
            {method.map((m, i) => (
              <Reveal key={m.step} group="how">
                <div className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <span className="pill">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{m.step}</h3>
                    <p>{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
