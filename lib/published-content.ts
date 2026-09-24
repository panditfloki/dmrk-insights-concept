import { cache } from "react";
import type { ContentItem } from "./content";
import { allItems } from "./content-seed";

/** The Vercel concept keeps its seed data; AWS explicitly enables the CMS. */
export const getPublishedContent = cache(async (): Promise<ContentItem[]> => {
  const base = process.env.DMRK_API_URL;
  if (!base) {
    if (process.env.DMRK_REQUIRE_API === "true") throw new Error("DMRK_API_URL is required");
    return allItems.map(item => ({...item, locked: item.type === 'article', body: item.type === 'article' ? item.body.split(/\n\s*\n/)[0] : item.body}));
  }
  const items: ContentItem[] = [];
  const cursors = new Set<string>();
  const slugs = new Set<string>();
  let cursor: string | null = null;
  for (let page = 0; page < 1000; page++) {
    const url = new URL(`${base.replace(/\/$/, "")}/content`);
    url.searchParams.set("limit", "100");
    if (cursor !== null) url.searchParams.set("cursor", cursor);
    const response = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error(`Content API returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.items) || !Array.isArray(data.errors) || data.errors.length !== 0 ||
        !(data.nextCursor === null || (typeof data.nextCursor === "string" && /^\d+$/.test(data.nextCursor)))) {
      throw new Error("Content API returned an incomplete or invalid publication");
    }
    for (const item of data.items) {
      if (!item || !["article", "report", "case"].includes(item.type) ||
          !["id", "slug", "title", "industry", "category", "publishDate", "image", "summary", "body"]
            .every((key) => typeof item[key] === "string" && item[key].length > 0) ||
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) {
        throw new Error("Content API returned an invalid or duplicate item");
      }
      slugs.add(item.slug);
      items.push(item);
    }
    cursor = data.nextCursor;
    if (cursor === null) return items.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
    if (cursors.has(cursor)) throw new Error("Content API repeated a pagination cursor");
    cursors.add(cursor);
  }
  throw new Error("Content API pagination did not complete");
});
