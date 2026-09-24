import { getPublishedContent } from '@/lib/published-content';
export const dynamic = "force-dynamic";
import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import Link from "@/components/WebsiteLink";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";

export async function generateMetadata() { return pageMetadata('about'); }

export default async function AboutPage() {
  const {site, page, copy} = await getWebsitePage('about');
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
          <p className="eyebrow">{copy("text_1", "About DMRK Insights") }</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "18ch" }}>{copy("text_2", "Research designed around the decision.") }</h1>
          <p className="lede">{copy("text_3", "DMRK Insights is a market research and strategic consulting practice that helps organizations evaluate markets, understand customers, and act on evidence. Support spans") }{" "}{REGIONS}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_4", "Our approach") }</Reveal>
              <Reveal as="h2">{copy("text_5", "Evidence first, recommendation second") }</Reveal>
              <Reveal as="p">{copy("text_6", "Every engagement begins by defining the decision, the uncertainty surrounding it, and the evidence needed to move forward.") }</Reveal>
            </div>
          </div>
          <div className="grid grid--4">
            {method.map((m, i) => (
              <Reveal key={m.step} group="method">
                <article className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <span className="pill">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{m.step}</h3>
                    <p>{m.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--wash">
        <div className="wrap">
          <div className="grid grid--3">
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>{industries.length}{" "}{copy("text_7", "sectors") }</h3><p>{copy("text_8", "Each with its own panel, sample frame and benchmarks.") }</p></div></div></Reveal>
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>{allItems.length}{" "}{copy("text_9", "published pieces") }</h3><p>{copy("text_10", "Reports, case studies and articles, all method-stated.") }</p></div></div></Reveal>
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>{copy("text_11", "Five regions") }</h3><p>{REGIONS}.</p></div></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="cta">
            <div>
              <h2>{copy("text_12", "Tell us the decision you need to make.") }</h2>
              <p>{copy("text_13", "We will come back with the method, the sample and the timeline before any money moves.") }</p>
            </div>
            <Link className="button button--on-dark" href="/contact">{copy("text_14", "Talk to an analyst") }{" "}<Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
