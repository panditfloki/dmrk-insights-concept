import { getReaderContent } from '@/lib/reader';
import ReaderSignOut from '@/components/ReaderSignOut';
import { getWebsitePage } from '@/lib/website';
import { getPublishedContent } from "@/lib/published-content";
import type { Metadata } from "next";
import Link from "@/components/WebsiteLink";
import Image from "next/image";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import {
  formatDate,
  readingMinutes,
  TYPE_LABEL,
  TYPE_PLURAL,
} from "@/lib/content";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const allItems = await getPublishedContent();
  const item = allItems.find((i) => i.slug === slug);
  if (!item) return {};
  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.summary,
    alternates: item.canonicalUrl ? {canonical:item.canonicalUrl} : undefined,
    openGraph: { title: item.seoTitle || item.title, description: item.seoDescription || item.summary, images: [item.image] },
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{copy}, allItems, readerItem] = await Promise.all([
    getWebsitePage('insight-labels'),
    getPublishedContent(),
    process.env.DMRK_API_URL ? getReaderContent(slug).catch(() => null) : Promise.resolve(null),
  ]);
  const publishedItem = allItems.find((i) => i.slug === slug);
  const item = readerItem ?? (publishedItem ? {
    ...publishedItem,
    locked: publishedItem.type === 'article',
  } : null);
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
              <Link href="/insights">{copy("text_1", "Insights") }</Link>
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
              <span>{readingMinutes(item)}{" "}{copy("text_2", "min read") }</span>
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

              {item.locked ? <section className="reader-gate" aria-label="Continue reading"><h2>Continue reading with a free account</h2><p>Register or sign in to read the full article.</p><div className="hero-actions"><Link className="button" href={`/reader/register?next=${encodeURIComponent('/insights/'+slug)}`}>Create free account</Link><Link className="textlink" href={`/reader/login?next=${encodeURIComponent('/insights/'+slug)}`}>Already registered? Sign in</Link></div></section> : item.type==='article' ? <p className="reader-status">Full article unlocked. <ReaderSignOut/></p> : null}

              <div className="cta" style={{ marginTop: 32 }}>
                <div>
                  <h2 style={{ fontSize: "var(--step-2)" }}>{copy("text_3", "Need this for your market?") }</h2>
                  <p>{copy("text_4", "DMRK Insights can tailor this topic to your market, customer or growth question.") }</p>
                </div>
                <Link className="button button--on-dark" href="/contact">{copy("text_5", "Request research") }{" "}<Arrow /></Link>
              </div>
            </div>

            <aside>
              <div className="aside-card">
                <h3>{copy("text_6", "Details") }</h3>
                <dl>
                  <div>
                    <dt>{copy("text_7", "Format") }</dt>
                    <dd>{TYPE_LABEL[item.type]}</dd>
                  </div>
                  <div>
                    <dt>{copy("text_8", "Sector") }</dt>
                    <dd>{item.industry}</dd>
                  </div>
                  <div>
                    <dt>{copy("text_9", "Practice") }</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div>
                    <dt>{copy("text_10", "Published") }</dt>
                    <dd>{formatDate(item.publishDate)}</dd>
                  </div>
                </dl>
                <div className="divider" />
                <Link className="textlink" href={`/insights?industry=${encodeURIComponent(item.industry)}`}>{copy("text_11", "More in") }{" "}{item.industry} <Arrow />
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
                <Reveal as="p" className="eyebrow">{copy("text_12", "Related") }</Reveal>
                <Reveal as="h2" >{copy("text_13", "Continue reading") }</Reveal>
              </div>
              <Reveal><Link className="textlink" href="/insights">{copy("text_14", "All insights") }{" "}<Arrow /></Link></Reveal>
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
