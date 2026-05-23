import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutPhoto from "@assets/camila-about-profile_1779253450406.png";

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  { n: "01", title: "Front-end architecture" },
  { n: "02", title: "Motion & scroll systems" },
  { n: "03", title: "Design to production" },
  { n: "04", title: "Editorial interfaces" },
  { n: "05", title: "Product UI & dashboards" },
];

const skillMeters = [
  { label: "Front-end",   value: 92, detail: "React \u00B7 Next.js \u00B7 TypeScript" },
  { label: "Motion",      value: 88, detail: "GSAP \u00B7 Lenis \u00B7 ScrollTrigger" },
  { label: "Design",      value: 84, detail: "UI/UX \u00B7 Design systems \u00B7 Editorial" },
  { label: "Back-end",    value: 72, detail: "PostgreSQL \u00B7 Prisma \u00B7 APIs" },
];

export function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => section.classList.toggle("is-in-view", entry.isIntersecting),
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

      // ── Initial states ──────────────────────────────
      gsap.set(".about-display__line", { yPercent: 110, opacity: 0 });
      gsap.set(".about-id-meta__col", { y: 28, opacity: 0 });
      gsap.set(".about-bio", { y: 24, opacity: 0 });
      gsap.set(".about-photo-img", {
        scale: 1.3,
        filter: "grayscale(1) contrast(1.12) brightness(0.78)",
      });
      // cortina fechada — polygon idêntico ao CodePen de inspiração
      gsap.set(".about-photo-mask", {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      });
      gsap.set(".about-cap-item", { x: -44, opacity: 0 });
      gsap.set(".about-stat-num", { y: 48, opacity: 0 });
      gsap.set(".about-skill-loader", { y: 56, opacity: 0 });
      gsap.set(".about-skill-loader__bar", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".about-caps-tagline-inner", { x: "-112%" });

      // ── Intro TL (section scrolls into view, before pin) ──
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 84%",
          end: "top 22%",
          scrub: 1.05,
        },
      });

      introTl
        .to(".about-display__line", {
          yPercent: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.52,
          ease: "power3.out",
        }, 0.05)
        .to(".about-id-meta__col", {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.42,
          ease: "power3.out",
        }, 0.22)
        .to(".about-bio", {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        }, 0.38)
        ;

      // ── Horizontal scroll ───────────────────────────
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

      // duração explícita = número de painéis móveis (3),
      // assim as posições abaixo ficam em "unidades de painel"
      const N = panels.length - 1; // 3

      horizontalTl
        .to(track, {
          x: () => -(panels.length - 1) * window.innerWidth,
          ease: "none",
          duration: N,
        })
        .to(".about-photo-img", {
          xPercent: 5,
          ease: "none",
          duration: N,
        }, 0)
        .to(".about-progress-line", {
          scaleX: 1,
          ease: "none",
          duration: N,
        }, 0)
        // ── Reveal: cortina sobe de baixo quando o painel 2 entra em cena ──
        // posição 0.72 = ~72% do painel 1 percorrido (painel 2 quase visível)
        // duração 0.88 = termina em 1.60, bem dentro do painel 2
        .fromTo(".about-photo-mask",
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
          { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", ease: "power3.out", duration: 0.88 },
          0.72
        )
        // escala + cor revelam junto com a cortina (escala dura mais, como no CodePen)
        .fromTo(".about-photo-img",
          { scale: 1.3, filter: "grayscale(1) contrast(1.12) brightness(0.72) blur(10px)" },
          { scale: 1, filter: "grayscale(0) contrast(1) brightness(1) blur(0px)", ease: "power2.out", duration: 0.76 },
          0.72
        );

      // ── Capabilities list: panel 3 (index 2) ───────
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => `top+=${window.innerWidth * 1.55} top`,
          end: () => `top+=${window.innerWidth * 2.35} top`,
          scrub: 1.05,
        },
      })
        .to(".about-cap-item", {
          x: 0, opacity: 1, stagger: 0.09, duration: 0.45, ease: "power3.out",
        })
        .to(".about-caps-tagline-inner", {
          x: 0, stagger: 0.11, duration: 0.38, ease: "power3.out",
        }, 0.32);

      // ── Stats: panel 4 (index 3) ────────────────────
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => `top+=${window.innerWidth * 2.55} top`,
          end: () => `top+=${window.innerWidth * 3.1} top`,
          scrub: 1.05,
        },
      }).to(".about-stat-num", {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.42,
        ease: "power3.out",
      });

      // ── Counters for stat numbers ─────────────────────
      const statVals = gsap.utils.toArray<HTMLElement>(".about-stat-val");
      statVals.forEach((el) => {
        const target = Number(el.dataset.target) || 0;
        const counter = { value: 0 };
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${window.innerWidth * 2.68} top`,
            end: () => `top+=${window.innerWidth * 3.22} top`,
            scrub: 1.05,
          },
        }).to(counter, {
          value: target,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      // ── Skill loaders: panel 4 ──────────────────────
      const skillLoaders = gsap.utils.toArray<HTMLElement>(".about-skill-loader");
      skillLoaders.forEach((loader) => {
        const value = Number(loader.style.getPropertyValue("--target")) || 0;
        const number = loader.querySelector<HTMLElement>(".about-skill-loader__number");
        const bar = loader.querySelector<HTMLElement>(".about-skill-loader__bar");
        const counter = { value: 0 };

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top+=${window.innerWidth * 2.72} top`,
            end: () => `top+=${window.innerWidth * 3.38} top`,
            scrub: 1.05,
          },
        })
          .to(loader, { y: 0, opacity: 1, duration: 0.34, ease: "power3.out" }, 0)
          .to(bar, { scaleX: value / 100, duration: 0.72, ease: "power3.out" }, 0.1)
          .to(counter, {
            value,
            duration: 0.72,
            ease: "power3.out",
            onUpdate: () => {
              if (number) number.textContent = String(Math.round(counter.value));
            },
          }, 0.1);
      });

      // ── Panel crossfade ─────────────────────────────
      panels.forEach((panel, index) => {
        gsap.fromTo(
          panel,
          { opacity: index === 0 ? 1 : 0.12, scale: index === 0 ? 1 : 0.975 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${window.innerWidth * Math.max(0, index - 0.62)} top`,
              end: () => `top+=${window.innerWidth * Math.min(panels.length - 1, index + 0.62)} top`,
              scrub: true,
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

        {/* ── Panel 1 — Identity statement ── */}
        <article className="about-panel about-panel--identity">
          <div className="about-panel-content">
            <div className="about-id-top">
              <time className="about-year">2026</time>
            </div>

            <h2 className="about-display" aria-label="Camila Lopes">
              <span className="clip">
                <span className="about-display__line about-display__line--em">Camila</span>
              </span>
              <span className="clip">
                <span className="about-display__line">Lopes.</span>
              </span>
            </h2>

            <hr className="about-rule" />

            <dl className="about-id-meta">
              <div className="about-id-meta__col">
                <dt>Role</dt>
                <dd>Creative Developer</dd>
              </div>
              <div className="about-id-meta__col">
                <dt>Location</dt>
                <dd>Rio de Janeiro</dd>
              </div>
              <div className="about-id-meta__col">
                <dt>Focus</dt>
                <dd>Front-end + Motion + UI</dd>
              </div>
              <div className="about-id-meta__col">
                <dt>Status</dt>
                <dd className="about-status--available">Available</dd>
              </div>
            </dl>

            <div className="about-bio">
              <p>I'm Camila Lopes, a designer and front-end developer creating digital experiences with personality, rhythm, and intention.</p>
              <p>My work lives between design and code — where visual systems, motion, storytelling, and interaction come together.</p>
              <p>Inspired by Brazilian colors, organic forms, editorial layouts, and the energy of Rio, I build interfaces that feel warm, elegant, and alive.</p>
            </div>
          </div>
        </article>

        {/* ── Panel 2 — Portrait full-bleed ── */}
        <article className="about-panel about-panel--photo">
          <div className="about-photo-frame">
            <div className="about-photo-mask">
              <img
                className="about-photo-img"
                src={aboutPhoto}
                alt="Retrato editorial de Camila Lopes"
                loading="lazy"
              />
            </div>
            <div className="about-photo-overlay">
              <span className="about-photo-idx" aria-hidden="true">02</span>
              <p>Based in Brazil &middot; building refined digital interfaces for recruiters, studios and independent brands.</p>
            </div>
          </div>
        </article>

        {/* ── Panel 3 — Capabilities list ── */}
        <article className="about-panel about-panel--caps">
          <div className="about-panel-content">
            <div className="about-caps-header">
              <h3 className="about-caps-title text-[#ffffff] bg-[transparent] border-t-[#ffffff] border-r-[#ffffff] border-b-[#ffffff] border-l-[#ffffff]">
                Design sensibility<br />
                with front-end<br />
                execution.
              </h3>
            </div>
            <ol className="about-caps-list">
              {capabilities.map((cap) => (
                <li className="about-cap-item" key={cap.n}>
                  <span>{cap.n}</span>
                  <strong>{cap.title}</strong>
                </li>
              ))}
            </ol>

            <div className="about-caps-taglines" aria-hidden="true">
              {[
                "Design-led development.",
                "Culturally rooted interfaces.",
                "Motion with purpose.",
                "Digital experiences that feel alive.",
              ].map((line) => (
                <div className="about-caps-tagline" key={line}>
                  <span className="about-caps-tagline-inner">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* ── Panel 4 — Numbers + skill meters ── */}
        <article className="about-panel about-panel--numbers">
          <div className="about-panel-content">

            <div className="about-stats">
              <div className="about-stat">
                <strong className="about-stat-num">
                  <span className="about-stat-val" data-target="3">0</span>+
                </strong>
                <span className="about-stat-label">Years building</span>
              </div>
              <div className="about-stat">
                <strong className="about-stat-num">
                  <span className="about-stat-val" data-target="20">0</span>+
                </strong>
                <span className="about-stat-label">Projects shipped</span>
              </div>
              <div className="about-stat">
                <strong className="about-stat-num">
                  <span className="about-stat-val" data-target="50">0</span>+
                </strong>
                <span className="about-stat-label">UI components built</span>
              </div>
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
