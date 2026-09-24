// Content extracted from the CLIENT'S OWN live site (`content-data.js`, pulled 2026-09-13).
// 24 real items: 10 articles, 8 reports, 6 case studies. Nothing here is invented, seeded,
// or padded — every title, summary, body, date and industry is theirs.
//
// On the live site this array is the ONLY thing visitors ever see: their admin.html writes to
// localStorage, which never leaves the editor's browser. Replacing this file with a real API
// is the whole point of the backend half of this engagement.

export type ItemType = "article" | "report" | "case";

export interface ContentItem {
  locked?: boolean;
  readingMinutes?: number;
  statistics?: {value:string;label:string}[];
  categorySlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  id: string;
  slug: string;
  type: ItemType;
  title: string;
  industry: string;
  category: string;
  articleCategory?: string;
  publishDate: string;
  featured?: boolean;
  image: string;
  summary: string;
  body: string;
  url?: string;
}

export const TYPE_LABEL: Record<ItemType, string> = {
  article: "Article",
  report: "Report",
  case: "Case study",
};

export const TYPE_PLURAL: Record<ItemType, string> = {
  article: "Articles",
  report: "Reports",
  case: "Case studies",
};

export function formatDate(value: string): string {
  // en-IN to match the site's own og:locale.
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function readingMinutes(item: ContentItem): number {
  if (item.readingMinutes) return item.readingMinutes;
  const words = (item.body + " " + item.summary).trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
