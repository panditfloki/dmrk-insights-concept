"use client";
import ThemeSelect from "./ThemeSelect";
import { useWebsite } from '@/components/WebsiteProvider';
import { pageCopy, siteIndustries } from '@/lib/website-shared';

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import { TYPE_PLURAL, type ItemType, type ContentItem } from "@/lib/content";

const TYPES: ItemType[] = ["article", "report", "case"];

export default function Library({ items: allItems }: { items: ContentItem[] }) {
  const site = useWebsite();
  const copy = pageCopy(site.pages.find(p=>p.key==='library-labels'));
  const industries = useMemo(() => [...new Set([...siteIndustries(site).map(i => i.name), ...allItems.map(i => i.industry)])].sort(), [allItems, site]);
  const params = useSearchParams();
  const [type, setType] = useState<ItemType | "all">("all");
  const [industry, setIndustry] = useState<string>("all");

  // Deep links from the nav and the homepage industry tiles.
  useEffect(() => {
    const t = params.get("type");
    setType(t && (TYPES as string[]).includes(t) ? t as ItemType : "all");
    const i = params.get("industry");
    setIndustry(i && industries.includes(i) ? i : "all");
  }, [params, industries]);

  const results = useMemo(
    () =>
      allItems.filter(
        (i) => (type === "all" || i.type === type) && (industry === "all" || i.industry === industry)
      ),
    [type, industry, allItems]
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

        </div>

        <div className="filters industry-filter">
          <ThemeSelect searchable searchPlaceholder="Search industries" emptyMessage="No industries found. Try another search."
            label="Industry" value={industry} onChange={setIndustry}
            options={[{value: 'all', label: copy("text_2", "All sectors")}, ...industries.map(ind => ({value: ind, label: ind}))]} />
        </div>
        <p className="result-line" aria-live="polite">
          <span>{copy("text_3", "Showing") }{" "}<strong>{results.length}</strong>{" "}{copy("text_4", "of") }{" "}<strong>{allItems.length}</strong>{" "}{copy("text_5", "published pieces") }</span>
          {(type !== "all" || industry !== "all") && (
            <button
              className="chip"
              onClick={() => {
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
