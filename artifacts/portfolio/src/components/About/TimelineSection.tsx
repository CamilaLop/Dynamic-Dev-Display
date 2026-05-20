import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const items = [
  {
    n: "01",
    title: "Creative front-end",
    text: "Interfaces com identidade visual, precisão técnica e movimento com intenção.",
    side: "right" as const,
  },
  {
    n: "02",
    title: "Product thinking",
    text: "Experiências que unem clareza, conversão, narrativa e construção escalável.",
    side: "left" as const,
  },
  {
    n: "03",
    title: "Editorial motion",
    text: "Scroll, composição e microinterações tratados como parte do sistema visual.",
    side: "right" as const,
  },
];

const PATH_D =
  "M 200 10 C 380 80 380 180 320 260 C 260 340 120 370 80 440 C 40 510 100 555 200 580 C 300 605 380 650 340 720";

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const ball = ballRef.current;
    if (!section || !svg || !path || !ball) return;

    const totalLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });
    gsap.set(ball, { autoAlpha: 0 });
    gsap.set(".tl-node", { scale: 0, autoAlpha: 0, transformOrigin: "center" });
    gsap.set(".tl-card", { autoAlpha: 0, y: 28 });

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      master
        .to(ball, { autoAlpha: 1, duration: 0.04 }, 0)
        .to(
          path,
          { strokeDashoffset: 0, ease: "none", duration: 1 },
          0
        )
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

      const nodeProgresses = [0.31, 0.58, 0.82];

      nodeProgresses.forEach((p, i) => {
        master
          .to(
            `.tl-node-${i + 1}`,
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.06,
              ease: "elastic(2.5,1)",
            },
            p
          )
          .to(
            `.tl-card-${i + 1}`,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.1,
              ease: "power3.out",
            },
            p + 0.02
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tl-section">
      <div className="tl-sticky">
        <div className="tl-top-label">
          <span className="tl-kicker">— Index 04</span>
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
            <path
              ref={pathRef}
              className="tl-path"
              d={PATH_D}
              fill="none"
            />

            <circle className="tl-node tl-node-1" r="7" cx="320" cy="260" />
            <circle className="tl-node tl-node-2" r="7" cx="80" cy="440" />
            <circle className="tl-node tl-node-3" r="7" cx="340" cy="720" />

            <circle
              ref={ballRef}
              className="tl-ball"
              r="10"
              cx="200"
              cy="10"
            />
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
