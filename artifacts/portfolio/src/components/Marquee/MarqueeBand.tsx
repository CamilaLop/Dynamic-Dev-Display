import { useEffect, useRef } from "react";
import gsap from "gsap";

const MARQUEE_TEXT =
  "Creative Developer · Front-end Motion · Editorial Web · Rio de Janeiro · Available for Work · GSAP · React · TypeScript · ";

// Repeat enough so the inner is at least 2× the viewport at all screen sizes
const HALF = MARQUEE_TEXT.repeat(6);
const CONTENT = HALF + HALF; // doubled so we animate only the first half

interface MarqueeBandProps {
  theme?: "dark" | "light";
  speed?: number;
}

export function MarqueeBand({ theme = "dark", speed = 30 }: MarqueeBandProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // Animate from x:0 → x:-(half width), seamless because content is doubled
    const tween = gsap.to(inner, {
      x: () => -(inner.offsetWidth / 2),
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    const wrap = wrapRef.current;
    const slowDown = () =>
      gsap.to(tween, { timeScale: 0.18, duration: 0.7, ease: "power2.out", overwrite: true });
    const speedUp = () =>
      gsap.to(tween, { timeScale: 1, duration: 0.7, ease: "power2.in", overwrite: true });

    wrap?.addEventListener("mouseenter", slowDown);
    wrap?.addEventListener("mouseleave", speedUp);

    return () => {
      tween.kill();
      wrap?.removeEventListener("mouseenter", slowDown);
      wrap?.removeEventListener("mouseleave", speedUp);
    };
  }, [speed]);

  return (
    <div className={`marquee-band marquee-band--${theme}`} aria-hidden="true">
      <div ref={wrapRef} className="marquee-wrap">
        <div ref={innerRef} className="marquee-inner">
          {CONTENT}
        </div>
      </div>
    </div>
  );
}
