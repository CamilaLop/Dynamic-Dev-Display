import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DARK = "#201d1d";
const LIGHT = "#f4f4f1";

function setColors(bg: string) {
  gsap.to([document.documentElement, document.body], {
    backgroundColor: bg,
    duration: 0.55,
    ease: "power2.out",
    overwrite: true,
  });
}

const sectionMap: Array<{ selector: string; bg: string }> = [
  { selector: ".selected-section", bg: LIGHT },
  { selector: ".experience-section", bg: DARK },
  { selector: "#about", bg: LIGHT },
  { selector: ".tl-section", bg: DARK },
  { selector: ".rio-section", bg: DARK },
  { selector: ".footer-section", bg: DARK },
];

export function useThemeTransition(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const triggers = sectionMap.map(({ selector, bg }, index) => {
      const prevBg = index > 0 ? sectionMap[index - 1].bg : LIGHT;

      return ScrollTrigger.create({
        trigger: selector,
        start: "top 55%",
        onEnter: () => setColors(bg),
        onLeaveBack: () => setColors(prevBg),
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [active]);
}
