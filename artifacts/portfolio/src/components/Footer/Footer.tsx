import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-parallax",
        { y: 70 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top 20%",
            scrub: 1.4,
          },
        }
      );

      gsap.fromTo(
        ".footer-heading",
        { y: 40 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      );

      gsap.set(".footer-line", { scaleX: 0, transformOrigin: "left" });
      gsap.to(".footer-line", {
        scaleX: 1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        },
      });

      gsap.set([".footer-cta", ".footer-links"], { y: 30, opacity: 0 });
      gsap.to([".footer-cta", ".footer-links"], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 65%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={root} className="footer-section">
      <div className="footer-parallax">
        <div className="footer-top">
          <div className="footer-line" aria-hidden="true" />
        </div>

        <h2 className="footer-heading">
          Let's build something<br />
          <em>exceptional.</em>
        </h2>

        <a
          href="mailto:camila@example.com"
          className="footer-cta"
          aria-label="Send email to Camila"
        >
          camila@example.com
          <svg className="footer-cta-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        <span className="footer-location">Based in Rio de Janeiro</span>

        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
        </div>

        <p className="footer-copy">© 2026 Camila Lopes — All rights reserved</p>
      </div>
    </footer>
  );
}
