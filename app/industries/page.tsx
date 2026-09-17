import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import { sectors } from "@/lib/site";
import { industries, allItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Industries",
  description: "Sector intelligence for teams navigating change.",
};

export default function IndustriesPage() {
  const blurb = (name: string) => sectors.find((s) => s.name === name)?.blurb;

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Industries</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "20ch" }}>Sector intelligence for teams navigating change.</h1>
          <p className="lede">
            Explore research themes across established and emerging industries, from AI-enabled
            healthcare to electrified mobility.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            {industries.map((ind) => {
              const n = allItems.filter((i) => i.industry === ind).length;
              const b = blurb(ind);
              return (
                <Reveal key={ind} group="sectors">
                  <article className="card card--flat" style={{ height: "100%" }}>
                    <div className="card-body">
                      <h3>
                        <Link className="stretched" href={`/insights?industry=${encodeURIComponent(ind)}`}>{ind}</Link>
                      </h3>
                      {b ? <p>{b}</p> : <p style={{ color: "var(--muted)" }}>Coverage available on request.</p>}
                      <div className="card-foot">
                        <span className="textlink">{n} published {n === 1 ? "piece" : "pieces"} <Arrow /></span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
