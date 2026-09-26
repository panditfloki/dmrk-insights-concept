import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import Link from "@/components/WebsiteLink";
import Image from "next/image";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";


import { getPublishedContent } from "@/lib/published-content";

/* Every claim on this page comes from the client's own live site.
   No invented statistics, no placeholder counts, no stock testimonials. */





export async function generateMetadata() { return pageMetadata('home'); }

export const dynamic = "force-dynamic";

export default async function Home() {
  const {site, page, copy} = await getWebsitePage('home');
  const PILLARS = [0,1,2,3].map(i=>({t:copy(`pillars_${i}_t`),d:copy(`pillars_${i}_d`)}));
  const METHOD = [0,1,2,3].map(i=>({n:copy(`method_${i}_n`),t:copy(`method_${i}_t`),d:copy(`method_${i}_d`)}));
  const allItems = await getPublishedContent();
  const industries = ['BFSI', 'Consumer & Retail', 'Healthcare', 'Technology & Telecom'];
  const featuredCase = allItems.find((i) => i.id === settingsCopy(site)('featuredCaseId'));
  const latest = allItems.filter((i) => i.type === "article").slice(0,pageCount(site,'articlesCount',3));
  const reports = allItems.filter((i) => i.type === "report").slice(0,pageCount(site,'reportsCount',4));

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="wrap">
          <div>
            <Reveal group="hero" as="p" className="eyebrow">{copy("text_1", "Market research & strategic consulting") }</Reveal>
            <Reveal group="hero" as="h1">{copy("text_2", "Strategic consulting and research for") }{" "}<em>{copy("text_3", "confident decisions.") }</em>
            </Reveal>
            <Reveal group="hero" as="p" className="lede">{copy("text_4", "Market intelligence, customer research, competitor analysis and surveys, built so the method is visible and the recommendation is something leadership can act on.") }</Reveal>
            <Reveal group="hero" className="hero-actions">
              <Link className="button" href="/contact">{copy("text_5", "Request research") }{" "}<Arrow /></Link>
              <Link className="button button--ghost" href="/insights">{copy("text_6", "Browse insights") }{" "}<Arrow /></Link>
            </Reveal>
            <Reveal group="hero" className="hero-proof">
              <span className="pill pill--quiet">{siteIndustries(site).length}{" "}{copy("text_7", "sectors covered") }</span>
              <span className="pill pill--quiet">{allItems.length}{" "}{copy("text_8", "published pieces") }</span>
              <span className="pill pill--quiet">{copy("text_9", "India-first, global reach") }</span>
            </Reveal>
          </div>

          <Reveal group="hero" className="hero-panel">
            <h2>{copy("text_10", "From research to impact") }</h2>
            <p>{copy("text_11", "How an engagement actually runs.") }</p>
            <ol>
              {METHOD.map((m) => (
                <li key={m.n}>
                  <span className="n">{m.n}</span>
                  <span>
                    <strong>{m.t}</strong>
                    <span>{m.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ---------------- PILLARS ---------------- */}
      <section className="section section--tight section--wash">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_12", "What we do") }</Reveal>
              <Reveal as="h2">{copy("text_13", "Primary research that becomes action.") }</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/contact">{copy("text_14", "Scope a project") }{" "}<Arrow /></Link></Reveal>
          </div>
          <div className="grid grid--4">
            {PILLARS.map((p) => (
              <Reveal key={p.t} group="pillars" className="card card--flat">
                <div className="card-body">
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED CASE ---------------- */}
      {featuredCase && (
        <section className="section band">
          <div className="wrap">
            <div>
              <Reveal as="p" className="eyebrow" group="band">{copy("text_15", "Case study ·") }{" "}{featuredCase.industry}</Reveal>
              <Reveal as="h2" group="band">{featuredCase.title}</Reveal>
              <Reveal as="p" group="band" className="lede" >{featuredCase.summary}</Reveal>
              <Reveal group="band" className="band-stats">
                {/* Verbatim from the client's live homepage, and tied to THIS case study
                    by id — not to "the newest case", which is a different study. */}
                {(featuredCase.statistics || []).map((s) => (
                  <div className="band-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </Reveal>
              <Reveal group="band" style={{ marginTop: 26 }}>
                <Link className="button button--on-dark" href={`/insights/${featuredCase.slug}`}>{copy("text_17", "Read complete case study") }{" "}<Arrow />
                </Link>
              </Reveal>
            </div>
            <Reveal group="band" className="band-figure">
              <Image src={featuredCase.image} alt="" width={760} height={570} sizes="(max-width: 940px) 100vw, 40vw" />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------------- INDUSTRIES ---------------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_18", "Coverage") }</Reveal>
              <Reveal as="h2">{copy("text_19", "Coverage across every major sector") }</Reveal>
              <Reveal as="p">{copy("text_20", "Each sector has its own panel, its own sample frame and its own benchmarks.") }</Reveal>
            </div>
            <Reveal><Link className="button button--ghost" href="/insights">View more <Arrow /></Link></Reveal>
          </div>
          <div className="grid coverage-grid">
            {industries.map((ind) => {
              const n = allItems.filter((i) => i.industry === ind).length;
              return (
                <Reveal key={ind} group="industries">
                  <Link className="tile" href={`/insights?industry=${encodeURIComponent(ind)}`}>
                    <span>
                      {ind}
                      <small>{n}{" "}{copy("text_21", "published") }{" "}{n === 1 ? "piece" : "pieces"}</small>
                    </span>
                    <Arrow />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- LATEST ARTICLES ---------------- */}
      <section className="section section--wash">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_22", "Insights") }</Reveal>
              <Reveal as="h2">{copy("text_23", "Fresh articles from DMRK analysts") }</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights">{copy("text_24", "All insights") }{" "}<Arrow /></Link></Reveal>
          </div>
          <div className="grid grid--3">
            {latest.map((item, i) => (
              <Reveal key={item.id} group="latest">
                <Card item={item} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- REPORTS ---------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_25", "Reports") }</Reveal>
              <Reveal as="h2">{copy("text_26", "Reports, case studies and briefings") }</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights?type=report">{copy("text_27", "All reports") }{" "}<Arrow /></Link></Reveal>
          </div>
          <div className="grid grid--4">
            {reports.map((item) => (
              <Reveal key={item.id} group="reports">
                <article className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <span className="pill pill--quiet">{item.industry}</span>
                    <h3><Link href={`/insights/${item.slug}`} className="stretched">{item.title}</Link></h3>
                    <p>{item.summary}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="cta">
            <div>
              <h2>{copy("text_28", "Have a decision that needs evidence?") }</h2>
              <p>{copy("text_29", "Tell us the call you have to make. We will come back with the method, the sample and the timeline before any money moves.") }</p>
            </div>
            <Link className="button button--on-dark" href="/contact">{copy("text_30", "Talk to an analyst") }{" "}<Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
