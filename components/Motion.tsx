"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let runCount = 0;

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
  const pathname = usePathname();
  useEffect(() => {
    const run = ++runCount;
    console.log("[motion] setup", run, pathname);
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let frame = 0;
    const pending = new Map<HTMLElement, gsap.core.Tween>();

    const stopWatching = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const showAll = (error: unknown) => {
      console.error("[motion] reveal setup failed", error);
      stopWatching();
      try {
        ctx?.revert();
      } finally {
        revealEls.forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });
      }
    };

    function revealPending() {
      frame = 0;
      try {
        pending.forEach((tween, element) => {
          if (element.getBoundingClientRect().top > window.innerHeight * 0.88) return;
          tween.play();
          pending.delete(element);
        });
        if (!pending.size) stopWatching();
      } catch (error) {
        showAll(error);
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(revealPending);
    }

    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelector<HTMLElement>("[data-navbar]")?.setAttribute("data-stuck", "true");
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {});
      ctx.add(() => {
        const groups = new Map<string, HTMLElement[]>();
        revealEls.forEach((element) => {
          if (element.getBoundingClientRect().top < window.innerHeight) return;
          const key = element.dataset.revealGroup ?? `solo:${groups.size}`;
          const list = groups.get(key) ?? [];
          list.push(element);
          groups.set(key, list);
        });
        console.log("[motion] classify", {
          belowViewport: Array.from(groups.values()).reduce((total, elements) => total + elements.length, 0),
          viewportHeight: window.innerHeight,
          bodyHeight: document.body.scrollHeight,
        });

        groups.forEach((elements) => {
          gsap.set(elements, { opacity: 0, y: 18 });
          const tween = gsap.to(
            elements,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.15,
              paused: true,
            }
          );
          pending.set(elements[0], tween);
        });

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();

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
    } catch (error) {
      showAll(error);
    }

    return () => {
      console.log("[motion] cleanup", run, pathname);
      stopWatching();
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
