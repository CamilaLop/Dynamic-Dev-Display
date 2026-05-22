import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const items = [
  {
    n: "01",
    title: "Creative front-end",
    text: "Interfaces with visual identity, technical precision and motion with intention.",
    side: "right" as const,
  },
  {
    n: "02",
    title: "Product thinking",
    text: "Experiences that unite clarity, conversion, storytelling and scalable architecture.",
    side: "left" as const,
  },
  {
    n: "03",
    title: "Editorial motion",
    text: "Scroll, composition and micro-interactions treated as part of the visual system.",
    side: "right" as const,
  },
];

const PATH_D =
  "M 200 10 C 380 80 380 180 320 260 C 260 340 120 370 80 440 C 40 510 100 555 200 580 C 300 605 380 650 340 720";

// node (cx, cy) for each milestone
const NODES = [
  { cx: 320, cy: 260 },
  { cx: 80,  cy: 440 },
  { cx: 340, cy: 720 },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const pathRef   = useRef<SVGPathElement>(null);
  const ballRef   = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const svg     = svgRef.current;
    const path    = pathRef.current;
    const ball    = ballRef.current;
    if (!section || !svg || !path || !ball) return;

    const totalLength = path.getTotalLength();

    // ── Initial states ───────────────────────────────
    gsap.set(path, { strokeDasharray: totalLength, strokeDashoffset: totalLength });
    gsap.set(ball, { autoAlpha: 0 });
    gsap.set(".tl-node",   { scale: 0, autoAlpha: 0, transformOrigin: "center" });
    gsap.set(".tl-card",   { autoAlpha: 0, y: 28 });
    gsap.set(".tl-hline",  { strokeDasharray: 400, strokeDashoffset: 400, autoAlpha: 0 });
    gsap.set(".tl-label",  { autoAlpha: 0 });
    gsap.set(".tl-ripple", { scale: 1, autoAlpha: 0, transformOrigin: "center" });

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      // ── Ball appears and path draws ──────────────────
      master
        .to(ball, { autoAlpha: 1, duration: 0.04 }, 0)
        .to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
        .to(
          ball,
          {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            ease: "none",
            duration: 1,
          },
          0
        );

      // ── At each node: pulse + hline reveal + card ────
      const nodeProgresses = [0.31, 0.58, 0.82];

      nodeProgresses.forEach((p, i) => {
        master
          // horizontal line draws from left
          .to(`.tl-hline-${i + 1}`, {
            strokeDashoffset: 0,
            autoAlpha: 1,
            duration: 0.1,
            ease: "power2.out",
          }, p - 0.02)
          // label fades in
          .to(`.tl-label-${i + 1}`, { autoAlpha: 1, duration: 0.04 }, p)
          // node: big elastic pop
          .to(`.tl-node-${i + 1}`, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.07,
            ease: "elastic(3, 1)",
          }, p)
          // ripple: scale out and fade
          .fromTo(
            `.tl-ripple-${i + 1}`,
            { scale: 1, autoAlpha: 0.7 },
            { scale: 4.5, autoAlpha: 0, duration: 0.18, ease: "power2.out", transformOrigin: "center" },
            p
          )
          // card slides up
          .to(`.tl-card-${i + 1}`, {
            autoAlpha: 1,
            y: 0,
            duration: 0.1,
            ease: "power3.out",
          }, p + 0.03);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tl-section">
      <div className="tl-sticky">
        <div className="tl-top-label">
          <h2 className="tl-heading">
            The <em>approach</em>
          </h2>
        </div>

        <div className="tl-stage">
          <svg
            ref={svgRef}
            className="tl-svg"
            viewBox="0 0 400 740"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Animated curved path */}
            <path ref={pathRef} className="tl-path" d={PATH_D} fill="none" />

            {/* Horizontal milestone lines */}
            {NODES.map((n, i) => (
              <line
                key={i}
                className={`tl-hline tl-hline-${i + 1}`}
                x1="0" y1={n.cy}
                x2="400" y2={n.cy}
              />
            ))}

            {/* Milestone labels */}
            <text className="tl-label tl-label-1" x="8" y={NODES[0].cy - 6}>01 Creative</text>
            <text className="tl-label tl-label-2" x="8" y={NODES[1].cy - 6}>02 Product</text>
            <text className="tl-label tl-label-3" x="8" y={NODES[2].cy - 6}>03 Motion</text>

            {/* Node dots */}
            <circle className="tl-node tl-node-1" r="7" cx={NODES[0].cx} cy={NODES[0].cy} />
            <circle className="tl-node tl-node-2" r="7" cx={NODES[1].cx} cy={NODES[1].cy} />
            <circle className="tl-node tl-node-3" r="7" cx={NODES[2].cx} cy={NODES[2].cy} />

            {/* Ripple rings at each node */}
            <circle className="tl-ripple tl-ripple-1" r="7" cx={NODES[0].cx} cy={NODES[0].cy} />
            <circle className="tl-ripple tl-ripple-2" r="7" cx={NODES[1].cx} cy={NODES[1].cy} />
            <circle className="tl-ripple tl-ripple-3" r="7" cx={NODES[2].cx} cy={NODES[2].cy} />

            {/* Traveling ball */}
            <circle ref={ballRef} className="tl-ball" r="10" cx="200" cy="10" />
          </svg>

          <div className="tl-cards-wrap">
            {items.map((item, i) => (
              <div
                key={item.n}
                className={`tl-card tl-card-${i + 1} tl-card--${item.side}`}
              >
                <span className="tl-card-n">{item.n}</span>
                <h3 className="tl-card-title">{item.title}</h3>
                <p className="tl-card-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
