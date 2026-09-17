import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import {
  allItems,
  getBySlug,
  formatDate,
  readingMinutes,
  TYPE_LABEL,
  TYPE_PLURAL,
} from "@/lib/content";

export function generateStaticParams() {
  return allItems.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    openGraph: { title: item.title, description: item.summary, images: [item.image] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getBySlug(slug);
  if (!item) notFound();

  const related = allItems
    .filter((i) => i.id !== item.id && (i.industry === item.industry || i.type === item.type))
    .slice(0, 3);

  const paragraphs = item.body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <article>
        <section className="article-hero">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/insights">Insights</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/insights?type=${item.type}`}>{TYPE_PLURAL[item.type]}</Link>
            </nav>
            <Reveal as="p" className="eyebrow" group="ah">
              {TYPE_LABEL[item.type]} · {item.category}
            </Reveal>
            <Reveal as="h1" group="ah">{item.title}</Reveal>
            <Reveal as="p" className="lede" group="ah">{item.summary}</Reveal>
            <Reveal group="ah" className="meta" style={{ marginTop: 18 }}>
              <span>{item.industry}</span>
              <i className="dot" />
              <time dateTime={item.publishDate}>{formatDate(item.publishDate)}</time>
              <i className="dot" />
              <span>{readingMinutes(item)} min read</span>
            </Reveal>
          </div>
        </section>

        <div className="wrap">
          <Reveal className="article-figure">
            <Image src={item.image} alt="" width={1400} height={600} priority sizes="100vw" />
          </Reveal>
        </div>

        <div className="wrap">
          <div className="article-layout">
            <div className="article-body" data-exec="Reading">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <div className="cta" style={{ marginTop: 32 }}>
                <div>
                  <h2 style={{ fontSize: "var(--step-2)" }}>Need this for your market?</h2>
                  <p>DMRK Insights can tailor this topic to your market, customer or growth question.</p>
                </div>
                <Link className="button button--on-dark" href="/contact">Request research <Arrow /></Link>
              </div>
            </div>

            <aside>
              <div className="aside-card">
                <h3>Details</h3>
                <dl>
                  <div>
                    <dt>Format</dt>
                    <dd>{TYPE_LABEL[item.type]}</dd>
                  </div>
                  <div>
                    <dt>Sector</dt>
                    <dd>{item.industry}</dd>
                  </div>
                  <div>
                    <dt>Practice</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>{formatDate(item.publishDate)}</dd>
                  </div>
                </dl>
                <div className="divider" />
                <Link className="textlink" href={`/insights?industry=${encodeURIComponent(item.industry)}`}>
                  More in {item.industry} <Arrow />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section--tight section--wash">
          <div className="wrap">
            <div className="section-head">
              <div>
                <Reveal as="p" className="eyebrow">Related</Reveal>
                <Reveal as="h2" >Continue reading</Reveal>
              </div>
              <Reveal><Link className="textlink" href="/insights">All insights <Arrow /></Link></Reveal>
            </div>
            <div className="grid grid--3">
              {related.map((r) => (
                <Reveal key={r.id} group="related">
                  <Card item={r} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
