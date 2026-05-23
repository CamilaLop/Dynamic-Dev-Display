import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SemiLogoSymbol } from "../Brand/SemiLogoSymbol";
import rioBg from "@assets/rio-paisagem_1779253459430.png";

gsap.registerPlugin(ScrollTrigger);

export function RioEditorial() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".rio-reveal", { yPercent: 105, opacity: 0 });
      gsap.set(".rio-sym", { rotate: 22, scale: 0.76, opacity: 0 });

      // ── Background photo: subtle zoom out as section scrolls in ──
      gsap.fromTo(
        ".rio-bg-photo img",
        { scale: 1.1 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.2,
          },
        }
      );

      // ── Overlay dims as text appears ──
      gsap.fromTo(
        ".rio-bg-overlay",
        { opacity: 0.55 },
        {
          opacity: 0.72,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "center center",
            scrub: 1.4,
          },
        }
      );

      gsap.fromTo(
        ".rio-parallax-layer",
        { y: 90 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top 15%",
            scrub: 1.4,
          },
        }
      );

      gsap.fromTo(
        ".rio-title",
        { y: 50 },
        {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      );

      gsap.fromTo(
        ".rio-stats",
        { y: 36 },
        {
          y: -18,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

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

      {/* Background photo with parallax zoom */}
      <div className="rio-bg-photo" aria-hidden="true">
        <img src={rioBg} alt="" loading="lazy" />
        <div className="rio-bg-overlay" />
      </div>

      <div className="rio-parallax-layer">
        <div className="rio-title">
          <h2 className="rio-reveal text-[#d9d9d9]">
            Rio Editorial
            <br />
            System.
            <SemiLogoSymbol className="rio-sym" />
          </h2>
        </div>

        <div className="rio-grid">
          <div className="rio-text rio-reveal">
            <p>
              A visual system inspired by Rio — editorial composition, soft motion
              and a distinct digital identity.
            </p>
            <p>
              Each project works as a living page: hierarchy first, motion in service
              of reading, and interaction without excess.
            </p>
          </div>
        </div>

        <div className="rio-stats">
          {[
            { k: "UI Motion",   v: "smooth and intentional interactions" },
            { k: "Editorial",   v: "layout with rhythm, scale and breathing room" },
            { k: "Rio · Web",   v: "subtle Brazilianness in the visual system" },
          ].map((item) => (
            <div key={item.k} className="rio-stat rio-reveal">
              <div className="text-[#d9d9d9]">{item.k}</div>
              <p>{item.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
