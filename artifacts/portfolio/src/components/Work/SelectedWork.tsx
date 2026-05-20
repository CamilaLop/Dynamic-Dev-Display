import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SemiLogoSymbol } from "../Brand/SemiLogoSymbol";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    n: "01",
    title: "Landing Pages",
    category: "Conversion Design",
    year: "2024",
    description: "Landing pages elegantes para serviços, com narrativa, hierarquia e foco em conversão.",
  },
  {
    n: "02",
    title: "Clinic Agents",
    category: "Automation",
    year: "2024",
    description: "Agentes de atendimento e agenda para clínicas, com fluxo simples e humano.",
  },
  {
    n: "03",
    title: "Data Dashboards",
    category: "Product UI",
    year: "2024",
    description: "Dashboards limpos, filtros inteligentes e leitura clara para decisões rápidas.",
  },
  {
    n: "04",
    title: "Commerce Flow",
    category: "E-commerce",
    year: "2025",
    description: "Páginas comerciais com performance, banco de dados e experiência visual premium.",
  },
  {
    n: "05",
    title: "Brand Motion",
    category: "Identity + Web",
    year: "2025",
    description: "Sistemas visuais vivos, com símbolos, grid e microinterações de marca.",
  },
  {
    n: "06",
    title: "Rio Interfaces",
    category: "Creative Front-end",
    year: "2026",
    description: "Experiências digitais com brasilidade sutil, contraste elegante e scroll cinematográfico.",
  },
  {
    n: "07",
    title: "Editorial Systems",
    category: "Motion UI",
    year: "2026",
    description: "Interfaces com ritmo de revista, transições precisas e direção visual autoral.",
  },
];

export function SelectedWork() {
  const root = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const setActiveProject = (index: number) => {
    setActiveIdx(index);
  };

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const colors = ["255,90,80", "125,250,225", "225,150,225"];

      gsap.set(".selected-reveal", {
        yPercent: 115,
        opacity: 0,
      });

      gsap.set(".selected-symbol", {
        rotate: -24,
        scale: 0.72,
        opacity: 0,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: ".selected-section",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      })
        .to(".selected-reveal", {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.065,
          ease: "expo.out",
        })
        .to(
          ".selected-symbol",
          {
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "expo.out",
          },
          0.18
        );

      gsap.set(".carousel", { opacity: 1 });
      gsap.set(".work-semicircle-transition", { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(".work-semicircle-dark", { scale: 0 });
      gsap.set(".work-transition-label", { yPercent: 35, opacity: 0 });

      gsap.set(".work-side-copy__item", { yPercent: 24, opacity: 0 });
      gsap.set('.work-side-copy__item[data-copy-index="0"]', { yPercent: 0, opacity: 1 });

      const cardsTl = gsap.timeline({ defaults: { duration: 2 }, paused: true })
        .set(".card", {
          backgroundColor: (i) => "rgba(" + colors[gsap.utils.wrap(0, colors.length, i)] + ",0.7)",
          backgroundImage: (i, _t, a) =>
            i === a.length - 1
              ? "radial-gradient(ellipse at 330px 120px, rgba(0,0,0,0) 30%, #000 150%)"
              : "radial-gradient(ellipse at 2500px -400px, rgba(0,0,0,0) 0%, #000 60%)",
          transformOrigin: "50% 999px -100px",
          backdropFilter: "blur(20px)",
          x: "-50%",
          y: "-45%",
          z: -500,
          rotateX: 2,
          autoAlpha: 1,
        })
        .to(".card", { z: 10, rotateX: -3, stagger: -1 }, 0)
        .to(".card", { yPercent: 100, stagger: -1, ease: "back.in(2)" }, 0)
        .to(
          ".card",
          {
            duration: 1,
            backdropFilter: "blur(8px)",
            backgroundImage:
              "radial-gradient(ellipse at 150px 250px, rgba(0,0,0,0) 80%, #000 300%)",
            stagger: -1,
            ease: "power3.in",
          },
          0
        )
        .to(
          ".card",
          {
            duration: 1,
            backdropFilter: "blur(1px)",
            backgroundImage:
              "radial-gradient(ellipse at -1000px 500px, rgba(0,0,0,0) 0%, #000 50%)",
            stagger: -1,
            ease: "sine.in",
          },
          1
        )
        .to(".card", { duration: 0.1, autoAlpha: 0, stagger: -1 }, 1.9);

      cardsTl.progress(0.07);

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: ".index02-main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: ".carousel",
          anticipatePin: 1,
          id: "workCarousel",
          invalidateOnRefresh: true,
          onRefresh: () => cardsTl.invalidate(),
        },
      });

      master.to(cardsTl, { progress: 1, duration: 0.78, ease: "none" }, 0);

      cards.forEach((_, index) => {
        const start = index * (0.78 / cards.length);
        const current = `.work-side-copy__item[data-copy-index="${index}"]`;
        const previous = `.work-side-copy__item[data-copy-index="${index - 1}"]`;

        master.call(() => setActiveProject(index), [], start + 0.01);

        if (index > 0) {
                    master
            .to(
              previous,
              {
                yPercent: -22,
                opacity: 0,
                duration: 0.045,
                ease: "power2.inOut",
              },
              start
            )
            .to(
              current,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.06,
                ease: "power2.inOut",
              },
              start + 0.015
            );
        }
      });

      master
        .to(".work-semicircle-transition", { autoAlpha: 1, duration: 0.02, ease: "none" }, 0.76)
        .to(".work-transition-label", { yPercent: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0.78)
        .to(".work-semicircle-dark", { scale: 1, duration: 0.22, ease: "power2.inOut" }, 0.8)
        .to(".work-transition-label", { yPercent: -45, opacity: 0, duration: 0.1, ease: "power2.in" }, 0.95);


      const dotButtons = gsap.utils.toArray<HTMLButtonElement>(".work-card-dot");

      dotButtons.forEach((button, index) => {
        button.onclick = () => {
          const trigger = ScrollTrigger.getById("workCarousel");
          if (!trigger) return;

          const count = cards.length;
          const safeIndex = Math.max(0, Math.min(index, count - 1));
          const cardProgress = safeIndex / Math.max(1, count - 1);
          const targetProgress = 0.02 + cardProgress * 0.74;
          const startScroll = window.scrollY;
          const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
          const proxy = { value: startScroll };

          gsap.to(proxy, {
            value: targetScroll,
            duration: 0.9,
            ease: "power3.inOut",
            overwrite: true,
            onUpdate: () => window.scrollTo(0, proxy.value),
          });
        };
      });

      const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
        .to(".arrow path", { attr: { d: "M0,0 0,10" }, ease: "power3.inOut" })
        .to(".arrow path", { attr: { d: "M0,10 0,10" }, ease: "power3.inOut" });

      gsap.to(".arrow", {
        opacity: 0,
        scrollTrigger: {
          trigger: ".index02-main",
          start: "top top",
          end: "top+=90 top",
          scrub: 1,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);

      return () => {
        arrowTl.kill();
        window.removeEventListener("resize", refresh);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={root} className="selected-section">
      <div className="selected-heading">
        <div className="clip">
          <div className="selected-reveal selected-label">— Index 02</div>
        </div>

        <div className="selected-title-wrap">
          <h2 className="selected-reveal selected-title">
            Selected Work
            <SemiLogoSymbol className="selected-symbol" />
          </h2>
        </div>

        <div className="clip">
          <p className="selected-reveal selected-copy">
            Projetos com direção visual, front-end criativo e interações editoriais.
          </p>
        </div>
      </div>

      <main className="index02-main">
        <div className="carousel">
          {cards.map((card, index) => (
            <div className="card" key={card.n} data-card-index={index}>
              <span>{card.n}</span>
            </div>
          ))}

          <div className="work-card-dots" aria-label="Selecionar projeto">
            {cards.map((card, index) => (
              <button
                key={card.n}
                className={`work-card-dot ${index === activeIdx ? 'is-active' : ''}`}
                type="button"
                data-dot-index={index}
                aria-label={`Ir para o projeto ${card.n} — ${card.title}`}
                aria-current={index === activeIdx}
              >
                <span>{card.n}</span>
              </button>
            ))}
          </div>

          <div className="work-side-copy" aria-hidden="true">
            {cards.map((card, index) => (
              <div className="work-side-copy__item" key={card.n} data-copy-index={index}>
                <span>{card.category} · {card.year}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>

          <div className="work-semicircle-transition" aria-hidden="true">
            <div className="work-semicircle-dark" />
          </div>

          <div className="work-transition-label">
            <span>next</span>
            <strong>Experience Index</strong>
          </div>
        </div>

        <svg className="arrow" viewBox="0 0 2 10" aria-hidden="true">
          <path stroke="#333" d="M0,0 0,0" />
        </svg>
      </main>
    </section>
  );
}
