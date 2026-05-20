import { useEffect, useRef } from "react";
import gsap from "gsap";

type PreloaderProps = {
  onDone: () => void;
};

export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const root = rootRef.current;
    if (!root) return;

    document.body.classList.add("is-loading");

    const stage = root.querySelector<SVGSVGElement>(".stage");
    const col = root.querySelector<SVGGElement>(".col");
    const box = root.querySelector<SVGGElement>(".box");

    if (!stage || !col || !box) {
      document.body.classList.remove("is-loading");
      onDone();
      return;
    }

    for (let i = 0; i < 9; i++) {
      const b = box.cloneNode(true);
      col.append(b);
    }

    gsap.set(root.querySelectorAll(".box"), {
      y: (i: number) => i * 10,
    });

    for (let i = 0; i <= 9; i++) {
      const c = col.cloneNode(true) as SVGGElement;

      gsap.set(c, {
        x: 10 * i,
        attr: { class: "col col" + i },
      });

      gsap.set(c.querySelectorAll(".box"), {
        attr: { class: "box" + i },
      });

      stage.append(c);
    }

    col.remove();

    const tl = gsap.timeline();

    tl.to(
      root.querySelectorAll(".col"),
      {
        duration: 1.5,
        y: 11,
        ease: "sine.inOut",
        stagger: {
          amount: 3,
          repeat: -1,
          yoyo: true,
        },
      },
      0
    );

    for (let i = 0; i <= 9; i++) {
      tl.add(
        gsap.fromTo(
          root.querySelectorAll(".box" + i + " *"),
          {
            y: (j: number) => gsap.utils.interpolate(77, -77, j / 10),
            transformOrigin: "50%",
            scale: 0.133,
          },
          {
            y: (j: number) => gsap.utils.interpolate(i, -i, j / 10),
            scale: 0.8,
            duration: 1,
            ease: "sine",
            repeat: -1,
            yoyo: true,
            yoyoEase: "sine.in",
          }
        ),
        i / 10
      );
    }

    tl.play(50);

    const handleClick = () => {
      gsap.to(stage, { fill: tl.isActive() ? "#ccc" : "#000" });
      gsap.to(tl, { timeScale: tl.isActive() ? 0 : 1 });
    };

    window.addEventListener("click", handleClick);

    const exit = gsap.timeline({
      delay: 3.05,
      onComplete: () => {
        tl.kill();
        window.removeEventListener("click", handleClick);
        document.body.classList.remove("is-loading");
        onDone();
      },
    });

    exit
      .to(root, {
        opacity: 0,
        duration: 0.75,
        ease: "sine.inOut",
      })
      .set(root, { display: "none" });

    return () => {
      tl.kill();
      exit.kill();
      window.removeEventListener("click", handleClick);
      document.body.classList.remove("is-loading");
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="preloader preloader--exact">
      <svg className="stage" viewBox="0 0 98 108">
        <mask id="m">
          <rect width="10" height="10" fill="#fff" />
        </mask>
        <g className="col">
          <g className="box" mask="url(#m)">
            <circle cx="5" cy="5" r="5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
