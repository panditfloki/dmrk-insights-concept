"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Arrow, Logo } from "./Icons";
import { useMegaMenu, Caret } from "./MegaMenu";
import { services } from "@/lib/site";
import { industries, allItems, featuredCase } from "@/lib/content";

const PANELS = ["services", "industries", "insights"] as const;
type PanelName = (typeof PANELS)[number];

const PLAIN = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mega = useMegaMenu(PANELS as unknown as string[]);

  useEffect(() => { setOpen(false); mega.close(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  const tabProps = (name: PanelName) => ({
    className: "megatab",
    "aria-expanded": mega.active === name,
    "aria-haspopup": true as const,
    "aria-controls": `mega-${name}`,
    onMouseEnter: () => mega.open(name),
    onFocus: () => mega.open(name),
    onClick: () => (mega.active === name ? mega.close() : mega.open(name)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); mega.open(name); }
    },
  });

  const latest = allItems.filter((i) => i.type === "article").slice(0, 2);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span className="topbar-note">Market intelligence, customer research and strategy support — India and beyond.</span>
          <Link href="/contact">Request research <Arrow /></Link>
        </div>
      </div>

    <header className="site-header">
      <nav
        className="navbar has-mega"
        data-navbar
        aria-label="Primary"
        onMouseLeave={mega.closeSoon}
        onMouseEnter={mega.cancelClose}
      >
        <div className="wrap">
          <Link href="/" className="brand">
            <Logo />
            <span>DMRK<small>Insights</small></span>
          </Link>

          <ul className="nav-links">
            <li><button {...tabProps("services")}>Services <Caret /></button></li>
            <li><button {...tabProps("industries")}>Industries <Caret /></button></li>
            <li><button {...tabProps("insights")}>Insights <Caret /></button></li>
            {PLAIN.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} onMouseEnter={mega.close}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link className="button button--ghost" href="/contact">Talk to an analyst</Link>
            <Link className="button nav-cta" href="/contact">Request research <Arrow /></Link>
            <button
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={open ? "bars is-open" : "bars"} aria-hidden="true"><i /><i /><i /></span>
            </button>
          </div>
        </div>

        {/* ---- mega panels: one container, panels crossfade inside it ---- */}
        <div className="mega-container" ref={mega.containerRef}>
          <div className="mega-panel" id="mega-services" ref={mega.setPanel("services")}>
            <div className="wrap mega-grid-2">
              <div className="mega-col">
                <h4 data-fade-stagger>What we do</h4>
                <ul className="mega-list">
                  {services.map((s) => (
                    <li key={s.slug} data-fade-stagger>
                      <Link href={`/services/${s.slug}`}>
                        <strong>{s.name}</strong>
                        <span>{s.menuBlurb}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mega-col">
                <h4 data-fade-stagger>Start here</h4>
                <ul className="mega-list">
                  <li data-fade-stagger>
                    <Link href="/services"><strong>All services</strong><span>How an engagement is framed, run and handed over.</span></Link>
                  </li>
                  <li data-fade-stagger>
                    <Link href="/about"><strong>Our approach</strong><span>Evidence first, recommendation second.</span></Link>
                  </li>
                  <li data-fade-stagger>
                    <Link href="/contact"><strong>Scope a project</strong><span>Tell us the decision you need to make.</span></Link>
                  </li>
                </ul>
              </div>
              {featuredCase && (
                <div className="mega-col mega-feature-col">
                  <h4 data-fade-stagger>Featured case study</h4>
                  <Link className="mega-feature" href={`/insights/${featuredCase.slug}`} data-fade-stagger>
                    <Image src={featuredCase.image} alt="" width={480} height={270} sizes="21rem" />
                    <div className="mf-body">
                      <span className="pill pill--quiet">{featuredCase.industry}</span>
                      <strong>Identifying a $5M revenue opportunity in regional logistics.</strong>
                      <p>50+ competitors benchmarked · 200+ KPIs reviewed · 6 markets prioritised</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mega-panel" id="mega-industries" ref={mega.setPanel("industries")}>
            <div className="wrap mega-grid-3">
              {[0, 1, 2].map((col) => (
                <div className="mega-col" key={col}>
                  {col === 0 && <h4 data-fade-stagger>Sectors we cover</h4>}
                  {col !== 0 && <h4 data-fade-stagger aria-hidden="true">&nbsp;</h4>}
                  <ul className="mega-list">
                    {industries
                      .filter((_, i) => i % 3 === col)
                      .map((ind) => {
                        const n = allItems.filter((x) => x.industry === ind).length;
                        return (
                          <li key={ind} data-fade-stagger>
                            <Link href={`/insights?industry=${encodeURIComponent(ind)}`}>
                              <strong>{ind}</strong>
                              <span>{n} published {n === 1 ? "piece" : "pieces"}</span>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
              <div className="mega-col mega-feature-col">
                <h4 data-fade-stagger>Sector coverage</h4>
                <ul className="mega-list">
                  <li data-fade-stagger>
                    <Link href="/industries"><strong>All industries</strong><span>Research themes across {industries.length} sectors.</span></Link>
                  </li>
                  <li data-fade-stagger>
                    <Link href="/contact"><strong>Not listed?</strong><span>Tell us the sector and the decision.</span></Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mega-panel" id="mega-insights" ref={mega.setPanel("insights")}>
            <div className="wrap mega-grid-2">
              <div className="mega-col">
                <h4 data-fade-stagger>Browse by format</h4>
                <ul className="mega-list">
                  <li data-fade-stagger><Link href="/insights"><strong>All insights</strong><span>{allItems.length} published pieces across {industries.length} sectors.</span></Link></li>
                  <li data-fade-stagger><Link href="/insights?type=article"><strong>Articles</strong><span>Research notes for decision makers.</span></Link></li>
                  <li data-fade-stagger><Link href="/insights?type=report"><strong>Reports</strong><span>Sector outlooks with method and sample stated.</span></Link></li>
                  <li data-fade-stagger><Link href="/insights?type=case"><strong>Case studies</strong><span>What the evidence changed.</span></Link></li>
                </ul>
              </div>
              <div className="mega-col mega-feature-col">
                <h4 data-fade-stagger>Latest</h4>
                <div style={{ display: "grid", gap: 12 }}>
                  {latest.map((a) => (
                    <Link className="mega-feature" href={`/insights/${a.slug}`} key={a.id} data-fade-stagger>
                      <div className="mf-body">
                        <span className="pill pill--quiet">{a.industry}</span>
                        <strong>{a.title}</strong>
                        <p>{a.summary.slice(0, 92)}…</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- mobile ---- */}
        <div id="mobile-menu" className="mobile-menu" data-open={open} hidden={!open}>
          <ul>
            <li><Link href="/">Home <Arrow /></Link></li>
            <li><Link href="/services">Services <Arrow /></Link></li>
            <li><Link href="/industries">Industries <Arrow /></Link></li>
            <li><Link href="/insights">Insights <Arrow /></Link></li>
            <li><Link href="/about">About <Arrow /></Link></li>
            <li><Link href="/contact">Contact <Arrow /></Link></li>
          </ul>
          <div className="mobile-menu-actions">
            <Link className="button button--ghost" href="/contact" onClick={() => setOpen(false)}>Talk to an analyst</Link>
            <Link className="button" href="/contact" onClick={() => setOpen(false)}>Request research <Arrow /></Link>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}
