import { getPublishedContent } from '@/lib/published-content';
export const dynamic = "force-dynamic";
import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import Link from "@/components/WebsiteLink";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import { Arrow } from "@/components/Icons";



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const services = siteServices(await getWebsite());
  const s = services.find(s=>s.slug===slug);
  const entry=(await getWebsite()).pages.find(p=>p.path===`/services/${slug}`);
  const c=pageCopy(entry);
  return s ? { title: c('seo_title',s.name), description: c('seo_description',s.intro) } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const {site, page, copy} = await getWebsitePage('service-labels');
  const { slug } = await params;
  const services = siteServices(await getWebsite());
  const s = services.find(s=>s.slug===slug);
  if (!s) notFound();

  const related = (await getPublishedContent()).slice(0, pageCount(site,'relatedCount',3));

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/services">{copy("text_1", "Services") }</Link>
            <span aria-hidden="true">/</span>
            <span>{s.name}</span>
          </nav>
          <p className="eyebrow">{s.name}</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "24ch" }}>{s.h1}</h1>
          <p className="lede">{s.intro}</p>
          <div className="hero-actions" style={{ marginTop: 24, marginBottom: 0 }}>
            <Link className="button" href="/contact">{copy("text_2", "Scope a project") }{" "}<Arrow /></Link>
            <Link className="button button--ghost" href="/insights">{copy("text_3", "See related work") }{" "}<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_4", "Capabilities") }</Reveal>
              <Reveal as="h2">{s.sectionTitle}</Reveal>
              <Reveal as="p">{s.sectionIntro}</Reveal>
            </div>
          </div>
          <div className="grid grid--3">
            {s.capabilities.map((c) => (
              <Reveal key={c.title} group="cap">
                <article className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
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
              <Reveal as="p" className="eyebrow">{copy("text_5", "Other services") }</Reveal>
              <Reveal as="h2">{copy("text_6", "Often scoped together") }</Reveal>
            </div>
          </div>
          <div className="grid grid--3">
            {services.filter((o) => o.slug !== s.slug).map((o) => (
              <Reveal key={o.slug} group="other">
                <Link className="tile" href={`/services/${o.slug}`}>
                  <span>{o.name}<small>{o.menuBlurb}</small></span>
                  <Arrow />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">{copy("text_7", "Insights") }</Reveal>
              <Reveal as="h2">{copy("text_8", "Recent work") }</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights">{copy("text_9", "All insights") }{" "}<Arrow /></Link></Reveal>
          </div>
          <div className="grid grid--3">
            {related.map((r) => (
              <Reveal key={r.id} group="rel"><Card item={r} /></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
