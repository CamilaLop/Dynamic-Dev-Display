import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SemiLogoSymbol } from "../Brand/SemiLogoSymbol";

gsap.registerPlugin(ScrollTrigger);

export function RioEditorial() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".rio-reveal", { yPercent: 105, opacity: 0 });
      gsap.set(".rio-sym", { rotate: 22, scale: 0.76, opacity: 0 });

      gsap.to(".rio-reveal", {
        yPercent: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".rio-title",
          start: "top 80%",
        },
      });

      gsap.to(".rio-sym", {
        rotate: -90,
        xPercent: -18,
        yPercent: 18,
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.3,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="rio-section">
      <div className="clip">
        <div className="rio-reveal rio-label">— Manifesto · 03</div>
      </div>

      <div className="rio-title">
        <h2 className="rio-reveal">
          Rio Editorial
          <br />
          System.
          <SemiLogoSymbol className="rio-sym" />
        </h2>
      </div>

      <div className="rio-grid">
        <div className="rio-text rio-reveal">
          <p>
            Um sistema visual inspirado no Rio, em composição editorial, movimento suave e
            identidade digital autoral.
          </p>
          <p>
            Cada projeto funciona como uma página viva: hierarquia primeiro, movimento a
            serviço da leitura e interação sem excesso.
          </p>
        </div>
      </div>

      <div className="rio-stats">
        {[
          { k: "UI Motion", v: "interações suaves e intencionais" },
          { k: "Editorial", v: "layout com ritmo, escala e respiro" },
          { k: "Rio · Web", v: "brasilidade sutil no sistema visual" },
        ].map((item) => (
          <div key={item.k} className="rio-stat rio-reveal">
            <div>{item.k}</div>
            <p>{item.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
