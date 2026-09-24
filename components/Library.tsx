"use client";
import ThemeSelect from "./ThemeSelect";
import { useWebsite } from '@/components/WebsiteProvider';
import { pageCopy, siteServices, siteIndustries } from '@/lib/website-shared';

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import { TYPE_PLURAL, type ItemType, type ContentItem } from "@/lib/content";

const TYPES: ItemType[] = ["article", "report", "case"];

export default function Library({ items: allItems }: { items: ContentItem[] }) {
  const site = useWebsite();
  const copy = pageCopy(site.pages.find(p=>p.key==='library-labels'));
  const industries = useMemo(() => [...new Set(allItems.map((i) => i.industry))].sort(), [allItems]);
  const params = useSearchParams();
  const [category, setCategory] = useState<string>("all");
  const [type, setType] = useState<ItemType | "all">("all");
  const [industry, setIndustry] = useState<string>("all");

  // Deep links from the nav and the homepage industry tiles.
  useEffect(() => {
    const t = params.get("type");
    if (t && (TYPES as string[]).includes(t)) setType(t as ItemType);
    const i = params.get("industry");
    if (i && industries.includes(i)) setIndustry(i);
  }, [params, industries]);

  const categories = site.categories;
  const selected = categories.find(c=>c.slug===category);
  const categorySlugs = [category,...categories.filter(c=>c.parentId===selected?.id).map(c=>c.slug)];
  const results = useMemo(
    () =>
      allItems.filter(
        (i) => (category === "all" || categorySlugs.includes(i.categorySlug||"")) && (type === "all" || i.type === type) && (industry === "all" || i.industry === industry)
      ),
    [type, industry, allItems, category, categorySlugs.join(",")]
  );

  const countFor = (t: ItemType) =>
    allItems.filter((i) => i.type === t && (industry === "all" || i.industry === industry)).length;

  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="filters">
          <div className="filters-group">
            <button className="chip" aria-pressed={type === "all"} onClick={() => setType("all")}>{copy("text_1", "All formats") }<span className="count">{allItems.filter((i) => industry === "all" || i.industry === industry).length}</span>
            </button>
            {TYPES.map((t) => (
              <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                {TYPE_PLURAL[t]}<span className="count">{countFor(t)}</span>
              </button>
            ))}
          </div>

          <span className="filters-sep" aria-hidden="true" />

          <div className="filters-group">
            <button className="chip" aria-pressed={industry === "all"} onClick={() => setIndustry("all")}>{copy("text_2", "All sectors") }</button>
            {industries.map((ind) => (
              <button key={ind} className="chip" aria-pressed={industry === ind} onClick={() => setIndustry(ind)}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="filters category-filter"><ThemeSelect label="Category" value={category} onChange={setCategory} options={[{value:'all',label:'All categories'},...categories.map(c=>({value:c.slug,label:`${c.parentId?'↳ ':''}${c.name}`}))]} /></div>
        <p className="result-line" aria-live="polite">
          <span>{copy("text_3", "Showing") }{" "}<strong>{results.length}</strong>{" "}{copy("text_4", "of") }{" "}<strong>{allItems.length}</strong>{" "}{copy("text_5", "published pieces") }</span>
          {(type !== "all" || industry !== "all" || category !== "all") && (
            <button
              className="chip"
              onClick={() => {
                setCategory("all");
                setType("all");
                setIndustry("all");
              }}
            >{copy("text_6", "Clear filters") }</button>
          )}
        </p>

        <div className="results">
          {results.length === 0 ? (
            <div className="results-empty">
              <h3>{copy("text_7", "Nothing published here yet") }</h3>
              <p>{copy("text_8", "No piece matches that combination. Clear a filter, or tell us what you need researched.") }</p>
            </div>
          ) : (
            <div className="grid grid--3">
              {results.map((item, i) => (
                <Card key={item.id} item={item} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
