import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import { allItems, getByType, industries, featuredCase, featuredCaseStats } from "@/lib/content";

/* Every claim on this page comes from the client's own live site.
   No invented statistics, no placeholder counts, no stock testimonials. */

const PILLARS = [
  { t: "Growth Strategy", d: "Market entry, sizing and prioritisation built on primary evidence." },
  { t: "Industry Reports", d: "Sector outlooks with the method and sample stated up front." },
  { t: "Survey Programs", d: "Instrument design, fieldwork controls and clean, weighted data." },
  { t: "Expert Panels", d: "Structured interviews with operators who have actually done it." },
];

const METHOD = [
  { n: "01", t: "Frame the decision", d: "Start from the call leadership must make, not the questionnaire." },
  { n: "02", t: "Collect primary evidence", d: "Surveys, expert interviews and competitor scans, with controls stated." },
  { n: "03", t: "Test the read", d: "Triangulate sources before a number reaches a slide." },
  { n: "04", t: "Hand over the action", d: "A recommendation with its assumptions and what would change it." },
];

export default function Home() {
  const latest = allItems.filter((i) => i.type === "article").slice(0, 3);
  const reports = getByType("report").slice(0, 4);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="wrap">
          <div>
            <Reveal group="hero" as="p" className="eyebrow">Market research &amp; strategic consulting</Reveal>
            <Reveal group="hero" as="h1">
              Strategic consulting and research for <em>confident decisions.</em>
            </Reveal>
            <Reveal group="hero" as="p" className="lede">
              Market intelligence, customer research, competitor analysis and surveys — built so the
              method is visible and the recommendation is something leadership can act on.
            </Reveal>
            <Reveal group="hero" className="hero-actions">
              <Link className="button" href="/contact">Request research <Arrow /></Link>
              <Link className="button button--ghost" href="/insights">Browse insights <Arrow /></Link>
            </Reveal>
            <Reveal group="hero" className="hero-proof">
              <span className="pill pill--quiet">{industries.length} sectors covered</span>
              <span className="pill pill--quiet">{allItems.length} published pieces</span>
              <span className="pill pill--quiet">India-first, global reach</span>
            </Reveal>
          </div>

          <Reveal group="hero" className="hero-panel">
            <h2>From research to impact</h2>
            <p>How an engagement actually runs.</p>
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
              <Reveal as="p" className="eyebrow">What we do</Reveal>
              <Reveal as="h2">Primary research that becomes action.</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/contact">Scope a project <Arrow /></Link></Reveal>
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
              <Reveal as="p" className="eyebrow" group="band">Case study · {featuredCase.industry}</Reveal>
              <Reveal as="h2" group="band">Identifying a $5M revenue opportunity in regional logistics.</Reveal>
              <Reveal as="p" group="band" className="lede" >{featuredCase.summary}</Reveal>
              <Reveal group="band" className="band-stats">
                {/* Verbatim from the client's live homepage, and tied to THIS case study
                    by id — not to "the newest case", which is a different study. */}
                {featuredCaseStats.map((s) => (
                  <div className="band-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </Reveal>
              <Reveal group="band" style={{ marginTop: 26 }}>
                <Link className="button button--on-dark" href={`/insights/${featuredCase.slug}`}>
                  Read complete case study <Arrow />
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
              <Reveal as="p" className="eyebrow">Coverage</Reveal>
              <Reveal as="h2">Coverage across every major sector</Reveal>
              <Reveal as="p">Each sector has its own panel, its own sample frame and its own benchmarks.</Reveal>
            </div>
          </div>
          <div className="grid grid--3">
            {industries.map((ind) => {
              const n = allItems.filter((i) => i.industry === ind).length;
              return (
                <Reveal key={ind} group="industries">
                  <Link className="tile" href={`/insights?industry=${encodeURIComponent(ind)}`}>
                    <span>
                      {ind}
                      <small>{n} published {n === 1 ? "piece" : "pieces"}</small>
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
              <Reveal as="p" className="eyebrow">Insights</Reveal>
              <Reveal as="h2">Fresh articles from DMRK analysts</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights">All insights <Arrow /></Link></Reveal>
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
              <Reveal as="p" className="eyebrow">Reports</Reveal>
              <Reveal as="h2">Reports, case studies and briefings</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights?type=report">All reports <Arrow /></Link></Reveal>
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
              <h2>Have a decision that needs evidence?</h2>
              <p>Tell us the call you have to make. We will come back with the method, the sample and the timeline before any money moves.</p>
            </div>
            <Link className="button button--on-dark" href="/contact">Talk to an analyst <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
