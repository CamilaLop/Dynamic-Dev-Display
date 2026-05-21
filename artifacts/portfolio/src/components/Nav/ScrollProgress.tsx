import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { selector: ".hero-section",       label: "01 — Hero" },
  { selector: ".selected-section",   label: "02 — Selected Work" },
  { selector: ".experience-section", label: "03 — Experience" },
  { selector: "#about",              label: "04 — About" },
  { selector: ".tl-section",         label: "05 — Approach" },
  { selector: ".rio-section",        label: "06 — Manifesto" },
  { selector: ".footer-section",     label: "07 — Contact" },
];

export function ScrollProgress() {
  const barRef   = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Global progress bar
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    // Section label
    const sectionTriggers = SECTIONS.map(({ selector, label }, i) => {
      const el = document.querySelector(selector);
      if (!el) return null;

      const prevLabel = i > 0 ? SECTIONS[i - 1].label : SECTIONS[0].label;

      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        onEnter: () => {
          if (!labelRef.current) return;
          gsap.to(labelRef.current, {
            opacity: 0,
            y: -6,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              if (labelRef.current) {
                labelRef.current.textContent = label;
                gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });
              }
            },
          });
        },
        onLeaveBack: () => {
          if (!labelRef.current) return;
          gsap.to(labelRef.current, {
            opacity: 0,
            y: 6,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              if (labelRef.current) {
                labelRef.current.textContent = prevLabel;
                gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });
              }
            },
          });
        },
      });
    });

    return () => {
      progressTrigger.kill();
      sectionTriggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <>
      {/* Thin progress bar — top of viewport */}
      <div className="sp-wrap" aria-hidden="true">
        <div ref={barRef} className="sp-bar" />
      </div>

      {/* Sticky section label — bottom-left */}
      <div className="sp-label" aria-hidden="true">
        <span ref={labelRef}>01 — Hero</span>
      </div>
    </>
  );
}
