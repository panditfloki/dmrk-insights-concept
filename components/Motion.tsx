"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The motion layer. Deliberately small.
 *
 * Reference calibration (measured from the two sites the client chose):
 *   GLG    — GSAP 3.15 + ScrollTrigger, duration 0.32/0.38/0.7, stagger 0.15,
 *            power-eases, nav surface change on scroll.
 *   Kantar — CSS transitions 0.25-0.5s. Those live in globals.css, not here.
 *
 * Lenis smooth-scroll is NOT used: it hijacks native scrolling, which costs more
 * than it gives on a research site people skim. Decision recorded in the state file.
 */
export default function Motion() {
  useEffect(() => {
    // Honour the OS setting before anything animates.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = gsap.utils.toArray<HTMLElement>("[data-reveal]");

    if (reduced) {
      // Never leave a reveal target stuck invisible.
      gsap.set(revealEls, { opacity: 1, y: 0, clearProps: "all" });
      document.querySelector<HTMLElement>("[data-navbar]")?.setAttribute("data-stuck", "true");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // ---- 1. Scroll reveal. Groups sharing a [data-reveal-group] stagger together.
      const groups = new Map<string, HTMLElement[]>();
      revealEls.forEach((el) => {
        const key = el.dataset.revealGroup ?? `solo:${groups.size}`;
        const list = groups.get(key) ?? [];
        list.push(el);
        groups.set(key, list);
      });

      groups.forEach((els) => {
        gsap.fromTo(
          els,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.15, // GLG's measured value
            scrollTrigger: {
              trigger: els[0],
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // ---- 2. Sticky nav surface change (GLG's gsap.to(nav, …), done as a data attr
      //         so the actual paint stays in CSS and stays themeable).
      const navbar = document.querySelector<HTMLElement>("[data-navbar]");
      if (navbar) {
        ScrollTrigger.create({
          start: "top -12",
          end: 99999,
          onUpdate: (self) =>
            navbar.setAttribute("data-stuck", String(self.scroll() > 12)),
          onRefresh: (self) =>
            navbar.setAttribute("data-stuck", String(self.scroll() > 12)),
        });
      }

    });

    return () => ctx.revert();
  }, []);

  return null;
}
