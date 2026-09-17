"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Icons";

export default function ScrollProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector("main");
    let frame = 0;
    let steps: { element: HTMLElement; name: string }[] = [];

    function identifySections() {
      steps = Array.from(main?.querySelectorAll<HTMLElement>("section, [data-exec]") ?? [])
        .map((element) => ({
          element,
          name: (
            element.dataset.exec ||
            element.getAttribute("aria-label") ||
            element.querySelector("h1, h2")?.textContent ||
            element.id.replace(/[-_]/g, " ")
          ).trim(),
        }))
        .filter((step) => step.name);
    }

    function measure() {
      frame = 0;
      const scroll = window.scrollY;
      const maximum = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scroll / maximum));
      const percent = Math.round(progress * 100);
      const readingLine = window.innerHeight * 0.35;
      let name = steps[0]?.name || main?.querySelector("h1")?.textContent || "Page";
      let latestTop = -Infinity;

      for (const step of steps) {
        const top = step.element.getBoundingClientRect().top;
        if (top <= readingLine && top >= latestTop) {
          latestTop = top;
          name = step.name;
        }
      }

      root.toggleAttribute("data-exec-on", scroll > 24);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (percentRef.current) percentRef.current.textContent = `${String(percent).padStart(3, "0")}%`;
      if (labelRef.current) labelRef.current.textContent = name;
      barRef.current?.setAttribute("aria-valuenow", String(percent));
      barRef.current?.setAttribute("aria-valuetext", `${percent}% · ${name}`);
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(measure);
    }

    identifySections();
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    const mutationObserver = new MutationObserver(() => {
      identifySections();
      schedule();
    });
    if (main) mutationObserver.observe(main, { childList: true, subtree: true, characterData: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      root.removeAttribute("data-exec-on");
    };
  }, [pathname]);

  return (
    <div
      className="execbar"
      data-execbar
      ref={barRef}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span className="execbar__left">
        <span className="execbar__play" aria-hidden="true">▶</span>
        <span className="execbar__caret" aria-hidden="true"><Logo size={12} markOnly /></span>
        <span className="execbar__label" data-exec-label ref={labelRef}>Page</span>
      </span>
      <b className="execbar__pct" data-exec-pct ref={percentRef}>000%</b>
      <span className="execbar__progress" data-exec-progress ref={progressRef} />
    </div>
  );
}
