"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import { allItems, industries, TYPE_PLURAL, type ItemType } from "@/lib/content";

const TYPES: ItemType[] = ["article", "report", "case"];

export default function Library() {
  const params = useSearchParams();
  const [type, setType] = useState<ItemType | "all">("all");
  const [industry, setIndustry] = useState<string>("all");

  // Deep links from the nav and the homepage industry tiles.
  useEffect(() => {
    const t = params.get("type");
    if (t && (TYPES as string[]).includes(t)) setType(t as ItemType);
    const i = params.get("industry");
    if (i && industries.includes(i)) setIndustry(i);
  }, [params]);

  const results = useMemo(
    () =>
      allItems.filter(
        (i) => (type === "all" || i.type === type) && (industry === "all" || i.industry === industry)
      ),
    [type, industry]
  );

  const countFor = (t: ItemType) =>
    allItems.filter((i) => i.type === t && (industry === "all" || i.industry === industry)).length;

  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="filters">
          <div className="filters-group">
            <button className="chip" aria-pressed={type === "all"} onClick={() => setType("all")}>
              All formats<span className="count">{allItems.filter((i) => industry === "all" || i.industry === industry).length}</span>
            </button>
            {TYPES.map((t) => (
              <button key={t} className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                {TYPE_PLURAL[t]}<span className="count">{countFor(t)}</span>
              </button>
            ))}
          </div>

          <span className="filters-sep" aria-hidden="true" />

          <div className="filters-group">
            <button className="chip" aria-pressed={industry === "all"} onClick={() => setIndustry("all")}>
              All sectors
            </button>
            {industries.map((ind) => (
              <button key={ind} className="chip" aria-pressed={industry === ind} onClick={() => setIndustry(ind)}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        <p className="result-line" aria-live="polite">
          <span>
            Showing <strong>{results.length}</strong> of <strong>{allItems.length}</strong> published pieces
          </span>
          {(type !== "all" || industry !== "all") && (
            <button
              className="chip"
              onClick={() => {
                setType("all");
                setIndustry("all");
              }}
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="results">
          {results.length === 0 ? (
            <div className="results-empty">
              <h3>Nothing published here yet</h3>
              <p>No piece matches that combination. Clear a filter, or tell us what you need researched.</p>
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
