import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutPhoto from "@assets/camila-about-profile_1779253450406.png";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "GSAP",
  "Lenis",
  "UI Motion",
  "Design Systems",
  "Landing Pages",
  "Dashboards",
  "PostgreSQL",
  "Prisma",
  "SQLite",
  "Supabase",
  "Stripe",
  "Python",
  "REST APIs",
  "UI/UX",
];

const highlights = [
  {
    n: "01",
    title: "Creative front-end",
    text: "Interfaces com identidade visual, precisão técnica e movimento com intenção.",
  },
  {
    n: "02",
    title: "Product thinking",
    text: "Experiências que unem clareza, conversão, narrativa e construção escalável.",
  },
  {
    n: "03",
    title: "Editorial motion",
    text: "Scroll, composição e microinterações tratados como parte do sistema visual.",
  },
];

const skillMeters = [
  {
    label: "Front-end",
    value: 92,
    detail: "React · Next.js · TypeScript",
  },
  {
    label: "Motion visual",
    value: 88,
    detail: "GSAP · Lenis · ScrollTrigger",
  },
  {
    label: "Design",
    value: 84,
    detail: "UI/UX · Design systems · Editorial layout",
  },
  {
    label: "Back-end",
    value: 72,
    detail: "PostgreSQL · Prisma · APIs",
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
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0,
            ease: "power2.inOut",
          },
        },
      });

      horizontalTl
        .to(track, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
        })
        .to(".about-photo-img", {
          scale: 1.04,
          xPercent: 6,
          ease: "none",
        }, 0)
        .to(".about-orbit", {
          rotate: 220,
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

        if (!content) return;

        gsap.fromTo(
          content,
          { y: 70, opacity: index === 0 ? 1 : 0.2 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${window.innerWidth * Math.max(0, index - 0.85)} top`,
              end: () => `top+=${window.innerWidth * (index + 0.15)} top`,
              scrub: 1.05,
            },
          }
        );
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
        <article className="about-panel about-panel--intro">
          <div className="about-panel-content">
            <p className="about-kicker">— About / Camila Lopes</p>

            <h2 className="about-title" aria-label="Creative developer with editorial precision">
              {"Creative developer with editorial precision".split(" ").map((word, index) => (
                <span className="clip" key={`${word}-${index}`}>
                  <span className="about-title-word">
                    {word}
                    {index < 4 ? "\u00A0" : ""}
                  </span>
                </span>
              ))}
            </h2>

            <p className="about-lead">
              Desenvolvedora front-end com olhar de designer. Eu projeto interfaces que combinam
              estética editorial, performance, arquitetura de componentes e movimento com propósito.
            </p>
          </div>
        </article>

        <article className="about-panel about-panel--photo">
          <div className="about-panel-content about-photo-content">
            <div className="about-photo-frame">
              <div className="about-photo-mask">
                <img className="about-photo-img" src={aboutPhoto} alt="Retrato editorial de Camila Lopes" />
              </div>

              <div className="about-orbit" aria-hidden="true">
                <span />
                <span />
              </div>
            </div>

            <p className="about-photo-caption">
              Based in Brazil · building refined digital interfaces for recruiters, studios and independent brands.
            </p>
          </div>
        </article>

        <article className="about-panel about-panel--skills">
          <div className="about-panel-content">
            <p className="about-kicker">— What I bring</p>
            <h3 className="about-panel-title">Design sensibility with front-end execution.</h3>
            <p className="about-copy">
              Meu diferencial está em transformar referências visuais em sistemas reais:
              layout, interação, componentes, dados e narrativa funcionando juntos.
            </p>

            <div className="about-skills" aria-label="Skills">
              {skills.map((skill) => (
                <span className="about-skill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </article>

        <article className="about-panel about-panel--highlights">
          <div className="about-panel-content">
            <p className="about-kicker">— For recruiters</p>
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
