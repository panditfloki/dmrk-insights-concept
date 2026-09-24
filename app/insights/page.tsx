import { getWebsitePage, getWebsite, pageMetadata } from '@/lib/website';
import { pageCopy, settingsCopy, siteServices, siteIndustries, siteMethod, pageCount } from '@/lib/website-shared';
import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedContent } from "@/lib/published-content";
import Library from "@/components/Library";

export async function generateMetadata() { return pageMetadata('insights'); }

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const [{copy}, items] = await Promise.all([
    getWebsitePage('insights'),
    getPublishedContent(),
  ]);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">{copy("text_1", "Insights") }</p>
          <h1 style={{ fontSize: "var(--step-3)" }}>{copy("text_2", "Research notes for decision makers") }</h1>
          <p className="lede">{copy("text_3", "Reports, case studies and articles. Filter by format or sector. Every piece states the method and the market it covers.") }</p>
        </div>
      </section>

      <Suspense fallback={null}>
        <Library items={items} />
      </Suspense>
    </>
  );
}
