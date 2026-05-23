import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSlidePins(active: boolean) {
  useEffect(() => {
    if (!active) return;

    // Defer until layout is stable
    const id = setTimeout(() => {
      const selectors = [".tl-section", ".rio-section", ".footer-section"];

      const panels = selectors
        .map((s) => document.querySelector<HTMLElement>(s))
        .filter((el): el is HTMLElement => el !== null);

      // Footer is the "landing surface" — it emerges but does not pin/fade
      const toPin = panels.slice(0, -1);

      toPin.forEach((panel) => {
        const winH = window.innerHeight;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              start: "bottom bottom",
              end: `+=${winH}`,
              pinSpacing: false,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          // Card shrinks and rounds as next section rises beneath it
          .fromTo(
            panel,
            { borderRadius: "0px", scale: 1, opacity: 1 },
            { borderRadius: "22px", scale: 0.86, opacity: 0.48, duration: 0.88, ease: "none" }
          )
          .to(panel, { opacity: 0, duration: 0.12, ease: "none" });
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [active]);
}
