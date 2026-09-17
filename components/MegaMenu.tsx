"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Rebuild of GLG's dropdown, using their own measured configuration:
 *   duration 0.32 / power2.inOut  — container height + nav surface
 *   fadeDuration 0.18             — panel crossfade
 *   stagger 0.03, staggerDuration 0.35, power1.out, delay fadeDuration * 0.5
 *
 * The mechanism that makes it feel like one surface, rather than four separate
 * dropdowns: switching tabs crossfades the panels *inside* a container whose
 * height tweens between their heights — the container never collapses to 0 and
 * reopens. Outgoing panels go to zIndex 0 / pointer-events none / inert.
 */
const CFG = {
  duration: 0.32,
  ease: "power2.inOut",
  fadeDuration: 0.18,
  stagger: 0.03,
  staggerDuration: 0.35,
} as const;

export function useMegaMenu(names: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  const reduced = useRef(false);

  const setPanel = useCallback((name: string) => (el: HTMLDivElement | null) => {
    panels.current[name] = el;
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = containerRef.current;
    if (c) gsap.set(c, { height: 0 });
    names.forEach((n) => {
      const p = panels.current[n];
      if (!p) return;
      gsap.set(p, { opacity: 0 });
      p.setAttribute("inert", "");
    });
  }, [names]);

  const staggerEls = (panel: HTMLElement) =>
    Array.from(panel.querySelectorAll<HTMLElement>("[data-fade-stagger]"));

  const open = useCallback(
    (name: string) => {
      if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
      const container = containerRef.current;
      const panel = panels.current[name];
      if (!container || !panel) return;
      setActive((prev) => {
        if (prev === name) return prev;

        // container height -> the incoming panel's height (never back to 0 first)
        gsap.killTweensOf(container);
        gsap.to(container, {
          height: panel.offsetHeight,
          duration: reduced.current ? 0 : CFG.duration,
          ease: CFG.ease,
        });

        // outgoing
        if (prev) {
          const out = panels.current[prev];
          if (out) {
            out.setAttribute("inert", "");
            gsap.set(out, { zIndex: 0, pointerEvents: "none" });
            gsap.killTweensOf(out);
            gsap.to(out, {
              opacity: 0,
              duration: reduced.current ? 0 : CFG.fadeDuration,
              ease: "power1.out",
              onComplete: () => gsap.set(staggerEls(out), { opacity: 0 }),
            });
          }
        }

        // incoming
        panel.removeAttribute("inert");
        gsap.set(panel, { zIndex: 1, pointerEvents: "auto" });
        gsap.killTweensOf(panel);
        gsap.to(panel, { opacity: 1, duration: reduced.current ? 0 : CFG.fadeDuration, ease: "power1.in" });
        gsap.fromTo(
          staggerEls(panel),
          { opacity: 0, y: reduced.current ? 0 : 6 },
          {
            opacity: 1,
            y: 0,
            duration: reduced.current ? 0 : CFG.staggerDuration,
            stagger: reduced.current ? 0 : CFG.stagger,
            ease: "power1.out",
            delay: reduced.current ? 0 : CFG.fadeDuration * 0.5,
          }
        );
        return name;
      });
    },
    []
  );

  const close = useCallback(() => {
    const container = containerRef.current;
    setActive((prev) => {
      if (!prev) return prev;
      const p = panels.current[prev];
      if (container) {
        gsap.killTweensOf(container);
        gsap.to(container, { height: 0, duration: reduced.current ? 0 : CFG.duration, ease: CFG.ease });
      }
      if (p) {
        p.setAttribute("inert", "");
        gsap.killTweensOf(p);
        gsap.to(p, {
          opacity: 0,
          duration: reduced.current ? 0 : CFG.fadeDuration,
          ease: "power1.out",
          onComplete: () => gsap.set(staggerEls(p), { opacity: 0 }),
        });
      }
      return null;
    });
  }, []);

  /** Small grace period so a diagonal mouse path between tab and panel doesn't close it. */
  const closeSoon = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, 120);
  }, [close]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  // Escape closes from anywhere in the nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return { active, open, close, closeSoon, cancelClose, containerRef, setPanel };
}

export function Caret() {
  return (
    <svg className="caret" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
