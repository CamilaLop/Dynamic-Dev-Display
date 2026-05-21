import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutPhoto from "@assets/camila-about-profile_1779253450406.png";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    n: "01",
    title: "Front-end architecture",
    text: "React, Next.js, TypeScript \u2014 components built for scale, performance, and maintainability.",
  },
  {
    n: "02",
    title: "Visual motion systems",
    text: "GSAP, Lenis, ScrollTrigger \u2014 scroll-driven storytelling with cinematic timing.",
  },
  {
    n: "03",
    title: "Product & conversion",
    text: "Landing pages, dashboards, and e-commerce flows that balance beauty with business.",
  },
  {
    n: "04",
    title: "Design to code",
    text: "From Figma to production \u2014 pixel-perfect implementation with design-system thinking.",
  },
];

const highlights = [
  {
    n: "01",
    title: "Creative front-end",
    text: "Interfaces with visual identity, technical precision, and motion with intention.",
  },
  {
    n: "02",
    title: "Product thinking",
    text: "Experiences that unite clarity, conversion, narrative, and scalable architecture.",
  },
  {
    n: "03",
    title: "Editorial motion",
    text: "Scroll, composition, and micro-interactions treated as part of the visual system.",
  },
];

const skillMeters = [
  {
    label: "Front-end",
    value: 92,
    detail: "React \u00B7 Next.js \u00B7 TypeScript",
  },
  {
    label: "Motion visual",
    value: 88,
    detail: "GSAP \u00B7 Lenis \u00B7 ScrollTrigger",
  },
  {
    label: "Design",
    value: 84,
    detail: "UI/UX \u00B7 Design systems \u00B7 Editorial layout",
  },
  {
    label: "Back-end",
    value: 72,
    detail: "PostgreSQL \u00B7 Prisma \u00B7 APIs",
  },
];

export function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("is-in-view", entry.isIntersecting);
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
      const track = section.querySelector<HTMLElement>(".about-horizontal-track");

      if (!track || !panels.length) return;

      gsap.set(".about-panel-content", {
        y: 86,
        opacity: 0,
      });

      gsap.set(".about-skill-loader", {
        y: 64,
        opacity: 0,
      });

      gsap.set(".about-skill-loader__bar", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(".about-highlight", {
        y: 42,
        opacity: 0,
      });

      gsap.set(".about-title-word", {
        yPercent: 112,
        opacity: 0,
      });

      gsap.set(".about-photo-img", {
        scale: 1.2,
        xPercent: -4,
        filter: "grayscale(1) contrast(1.12) brightness(0.78)",
      });

      gsap.set(".about-photo-mask", {
        clipPath: "inset(12% 18% 12% 18% round 2rem)",
      });

      gsap.set(".about-capability", {
        y: 48,
        opacity: 0,
      });

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 24%",
          scrub: 1.05,
        },
      });

      introTl
        .to(".about-title-word", {
          yPercent: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 0.45,
          ease: "power3.out",
        }, 0.08)
        .to(".about-panel-content", {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.42,
          ease: "power3.out",
        }, 0.18)
        .to(".about-photo-mask", {
          clipPath: "inset(0% 0% 0% 0% round 1.4rem)",
          duration: 0.52,
          ease: "power3.out",
        }, 0.22)
        .to(".about-capability", {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.4,
          ease: "power3.out",
        }, 0.52)
        .to(".about-highlight", {
          y: 0,
          opacity: 1,
          duration: 0.36,
          stagger: 0.06,
          ease: "power3.out",
        }, 0.52);

      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerWidth * (panels.length - 1)}`,
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      horizontalTl
        .to(track, {
          x: () => -(panels.length - 1) * window.innerWidth,
          ease: "none",
        })
        .to(".about-photo-img", {
          scale: 1.04,
          xPercent: 6,
          ease: "none",
        }, 0)
        .to(".about-progress-line", {
          scaleX: 1,
          ease: "none",
        }, 0);

      const skillLoaders = gsap.utils.toArray<HTMLElement>(".about-skill-loader");

      skillLoaders.forEach((loader) => {
        const value = Number(loader.style.getPropertyValue("--target")) || 0;
        const number = loader.querySelector<HTMLElement>(".about-skill-loader__number");
        const bar = loader.querySelector<HTMLElement>(".about-skill-loader__bar");
        const counter = { value: 0 };

        const skillTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${window.innerWidth * 2.35} top`,
            end: () => `top+=${window.innerWidth * 3.05} top`,
            scrub: 1.05,
          },
        });

        skillTl
          .to(loader, {
            y: 0,
            opacity: 1,
            duration: 0.34,
            ease: "power3.out",
          }, 0)
          .to(bar, {
            scaleX: value / 100,
            duration: 0.72,
            ease: "power3.out",
          }, 0.08)
          .to(counter, {
            value,
            duration: 0.72,
            ease: "power3.out",
            onUpdate: () => {
              if (number) number.textContent = String(Math.round(counter.value));
            },
          }, 0.08);
      });

      panels.forEach((panel, index) => {
        const content = panel.querySelector(".about-panel-content");

        // Panel-level cinematic crossfade: dimmed + scaled when off-center,
        // bright + sharp when in the viewport center
        gsap.fromTo(
          panel,
          {
            opacity: 0.2,
            scale: 0.97,
            filter: "brightness(1.08)",
          },
          {
            opacity: 1,
            scale: 1,
            filter: "brightness(1)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${window.innerWidth * Math.max(0, index - 0.55)} top`,
              end: () => `top+=${window.innerWidth * Math.min(panels.length - 1, index + 0.55)} top`,
              scrub: true,
            },
          }
        );

        // Content entrance: rises from below with staggered opacity
        if (content) {
          gsap.fromTo(
            content,
            { y: 70, opacity: 0.15 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${window.innerWidth * Math.max(0, index - 0.75)} top`,
                end: () => `top+=${window.innerWidth * (index + 0.12)} top`,
                scrub: 1.05,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="about-section about-stack-section">
      <div className="about-progress" aria-hidden="true">
        <span className="about-progress-line" />
      </div>

      <div className="about-horizontal-track">
        {/* Panel 1: Editorial intro */}
        <article className="about-panel about-panel--intro">
          <div className="about-panel-content">
            <span className="about-panel-index" aria-hidden="true">03</span>
            <p className="about-kicker">&mdash; About / Camila Lopes</p>

            <h2 className="about-title" aria-label="Creative developer with editorial precision">
              {"Creative developer".split(" ").map((word, index) => (
                <span className="clip" key={`${word}-${index}`}>
                  <span className="about-title-word">
                    {word}
                    {index < 2 ? "\u00A0" : ""}
                  </span>
                </span>
              ))}
              <br />
              {"with editorial".split(" ").map((word, index) => (
                <span className="clip" key={`${word}-b-${index}`}>
                  <span className="about-title-word">
                    {word}
                    {index < 2 ? "\u00A0" : ""}
                  </span>
                </span>
              ))}
              <br />
              <span className="clip">
                <span className="about-title-word">precision</span>
              </span>
            </h2>

            <p className="about-lead">
              Desenvolvedora front-end com olhar de designer. Eu projeto interfaces que combinam
              est\u00E9tica editorial, performance, arquitetura de componentes e movimento com prop\u00F3sito.
            </p>
          </div>
        </article>

        {/* Panel 2: Editorial photo */}
        <article className="about-panel about-panel--photo">
          <div className="about-photo-frame">
            <div className="about-photo-mask">
              <img className="about-photo-img" src={aboutPhoto} alt="Retrato editorial de Camila Lopes" />
            </div>
            <div className="about-photo-overlay" aria-hidden="true">
              <span className="about-panel-index about-index--light">03</span>
              <p>Based in Brazil &middot; building refined digital interfaces for recruiters, studios and independent brands.</p>
            </div>
          </div>
        </article>

        {/* Panel 3: Capabilities grid */}
        <article className="about-panel about-panel--capabilities">
          <div className="about-panel-content">
            <p className="about-kicker">&mdash; What I bring</p>
            <h3 className="about-panel-title">Design sensibility with front-end execution.</h3>

            <div className="about-capability-grid">
              {capabilities.map((cap) => (
                <div className="about-capability" key={cap.n}>
                  <span>{cap.n}</span>
                  <h4>{cap.title}</h4>
                  <p>{cap.text}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Panel 4: Highlights + meters */}
        <article className="about-panel about-panel--highlights">
          <div className="about-panel-content">
            <p className="about-kicker">&mdash; For recruiters</p>
            <h3 className="about-panel-title">I build the layer users feel first.</h3>

            <div className="about-highlight-grid">
              {highlights.map((item) => (
                <div className="about-highlight" key={item.n}>
                  <span>{item.n}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="about-skill-loaders" aria-label="Skill quality meters">
              {skillMeters.map((skill) => (
                <div
                  className="about-skill-loader"
                  key={skill.label}
                  style={{ "--target": skill.value } as CSSProperties}
                >
                  <div className="about-skill-loader__top">
                    <span>{skill.label}</span>
                    <strong>
                      <span className="about-skill-loader__number">0</span>
                      <em>/100</em>
                    </strong>
                  </div>

                  <div className="about-skill-loader__track" aria-hidden="true">
                    <span className="about-skill-loader__bar" />
                  </div>

                  <p>{skill.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
