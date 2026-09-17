import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import { method, REGIONS } from "@/lib/site";
import { allItems, industries } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "DMRK Insights is a market research and strategic consulting practice.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">About DMRK Insights</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "18ch" }}>Research designed around the decision.</h1>
          <p className="lede">
            DMRK Insights is a market research and strategic consulting practice that helps
            organizations evaluate markets, understand customers, and act on evidence. Support
            spans {REGIONS}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">Our approach</Reveal>
              <Reveal as="h2">Evidence first, recommendation second</Reveal>
              <Reveal as="p">
                Every engagement begins by defining the decision, the uncertainty surrounding it,
                and the evidence needed to move forward.
              </Reveal>
            </div>
          </div>
          <div className="grid grid--4">
            {method.map((m, i) => (
              <Reveal key={m.step} group="method">
                <article className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <span className="pill">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{m.step}</h3>
                    <p>{m.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--wash">
        <div className="wrap">
          <div className="grid grid--3">
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>{industries.length} sectors</h3><p>Each with its own panel, sample frame and benchmarks.</p></div></div></Reveal>
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>{allItems.length} published pieces</h3><p>Reports, case studies and articles, all method-stated.</p></div></div></Reveal>
            <Reveal group="facts"><div className="card card--flat"><div className="card-body">
              <h3>Five regions</h3><p>{REGIONS}.</p></div></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="cta">
            <div>
              <h2>Tell us the decision you need to make.</h2>
              <p>We will come back with the method, the sample and the timeline before any money moves.</p>
            </div>
            <Link className="button button--on-dark" href="/contact">Talk to an analyst <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
