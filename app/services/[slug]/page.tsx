import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import { Arrow } from "@/components/Icons";
import { services, getService } from "@/lib/site";
import { allItems } from "@/lib/content";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.name, description: s.intro } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = allItems.slice(0, 3);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span>{s.name}</span>
          </nav>
          <p className="eyebrow">{s.name}</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "24ch" }}>{s.h1}</h1>
          <p className="lede">{s.intro}</p>
          <div className="hero-actions" style={{ marginTop: 24, marginBottom: 0 }}>
            <Link className="button" href="/contact">Scope a project <Arrow /></Link>
            <Link className="button button--ghost" href="/insights">See related work <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">Capabilities</Reveal>
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
              <Reveal as="p" className="eyebrow">Other services</Reveal>
              <Reveal as="h2">Often scoped together</Reveal>
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
              <Reveal as="p" className="eyebrow">Insights</Reveal>
              <Reveal as="h2">Recent work</Reveal>
            </div>
            <Reveal><Link className="textlink" href="/insights">All insights <Arrow /></Link></Reveal>
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
