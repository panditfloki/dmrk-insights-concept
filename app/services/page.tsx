import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/Icons";
import { services, method } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Research-backed advisory for market, customer, and growth decisions.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Services</p>
          <h1 style={{ fontSize: "var(--step-3)", maxWidth: "22ch" }}>
            Research-backed advisory for market, customer, and growth decisions.
          </h1>
          <p className="lede">
            We help teams move from open questions to tested priorities through consulting,
            intelligence, primary research and expert access.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3">
            {services.map((s) => (
              <Reveal key={s.slug} group="svc">
                <article className="card" style={{ height: "100%" }}>
                  <div className="card-body">
                    <h3><Link href={`/services/${s.slug}`} className="stretched">{s.name}</Link></h3>
                    <p>{s.intro}</p>
                    <div className="card-foot">
                      <span className="textlink">Explore <Arrow /></span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--wash">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal as="p" className="eyebrow">How we work</Reveal>
              <Reveal as="h2">Structured enough for rigor, flexible enough for real business questions.</Reveal>
            </div>
          </div>
          <div className="grid grid--4">
            {method.map((m, i) => (
              <Reveal key={m.step} group="how">
                <div className="card card--flat" style={{ height: "100%" }}>
                  <div className="card-body">
                    <span className="pill">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{m.step}</h3>
                    <p>{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
