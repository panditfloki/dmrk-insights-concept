import { getPublishedContent } from '@/lib/published-content';
export const dynamic = "force-dynamic";
import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import Link from "@/components/WebsiteLink";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";

export async function generateMetadata() { return pageMetadata('industries'); }

export default async function IndustriesPage() {
  const {site, page, copy} = await getWebsitePage('industries');
  const allItems = await getPublishedContent();
  const industries = siteIndustries(site).map(s=>s.name);
  const sectors = siteIndustries(site);
  const services = siteServices(site);
  const method = siteMethod(site);
  const REGIONS = settingsCopy(site)('regions');
  const blurb = (name: string) => sectors.find((s) => s.name === name)?.blurb;

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{copy("text_1", "Industries") }</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "20ch" }}>{copy("text_2", "Sector intelligence for teams navigating change.") }</h1>
          <p className="lede">{copy("text_3", "Explore research themes across established and emerging industries, from AI-enabled healthcare to electrified mobility.") }</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            {industries.map((ind) => {
              const n = allItems.filter((i) => i.industry === ind).length;
              const b = blurb(ind);
              return (
                <Reveal key={ind} group="sectors">
                  <article className="card card--flat" style={{ height: "100%" }}>
                    <div className="card-body">
                      <h3>
                        <Link className="stretched" href={`/insights?industry=${encodeURIComponent(ind)}`}>{ind}</Link>
                      </h3>
                      {b ? <p>{b}</p> : <p style={{ color: "var(--muted)" }}>{copy("text_4", "Coverage available on request.") }</p>}
                      <div className="card-foot">
                        <span className="textlink">{n}{" "}{copy("text_5", "published") }{" "}{n === 1 ? "piece" : "pieces"} <Arrow /></span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
