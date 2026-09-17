import type { Metadata } from "next";
import { Suspense } from "react";
import Library from "@/components/Library";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Reports, case studies and articles from DMRK Insights — filtered by type and sector.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow">Insights</p>
          <h1 style={{ fontSize: "var(--step-3)" }}>Research notes for decision makers</h1>
          <p className="lede">
            Reports, case studies and articles. Filter by format or sector — every piece states the
            method and the market it covers.
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <Library />
      </Suspense>
    </>
  );
}
