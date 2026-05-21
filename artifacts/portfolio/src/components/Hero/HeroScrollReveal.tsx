import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "../Brand/Mark";

gsap.registerPlugin(ScrollTrigger);

type HeroScrollRevealProps = {
  heroImage: string;
  introActive: boolean;
  onIntroComplete?: () => void;
};

const firstName = "Camila".split("");
const lastName = "Lopes".split("");


function FledgeLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="fledge-link" aria-label={label}>
      <span className="fledge-word" aria-hidden="true">
        {label.split("").map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="fledge-char"
            data-char={char === " " ? "\u00A0" : char}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}

export function HeroScrollReveal({
  heroImage,
  introActive,
  onIntroComplete,
}: HeroScrollRevealProps) {
  const root = useRef<HTMLElement>(null);
  const introDone = useRef(false);

  useLayoutEffect(() => {
    if (!root.current || !introActive || introDone.current) return;

    const ctx = gsap.context(() => {
      document.body.classList.add("is-loading");

      gsap.set(".hero-letter", { yPercent: 118, opacity: 0 });
      gsap.set(".hero-image-shell", {
        scale: 0.74,
        opacity: 0,
        clipPath: "inset(44% 48% 44% 48%)",
      });
      gsap.set(".hero-image-inner", { scale: 1.22, yPercent: 4 });
      gsap.set(".hero-descriptor-inner", { yPercent: 115 });
      gsap.set(".scroll-cue", { yPercent: 40, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          introDone.current = true;
          document.body.classList.remove("is-loading");
          onIntroComplete?.();
          ScrollTrigger.refresh();
        },
      });

      tl.to(".hero-letter", {
        yPercent: 0,
        opacity: 1,
        duration: 1.25,
        stagger: { each: 0.035, from: "start" },
      })
        .to(
          ".hero-image-shell",
          {
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.25,
            ease: "expo.inOut",
          },
          "-=0.78"
        )
        .to(".hero-image-inner", { scale: 1.08, yPercent: 0, duration: 1.4 }, "<")
        .to(".hero-descriptor-inner", {
          yPercent: 0,
          duration: 0.88,
          stagger: 0.14,
          ease: "expo.out",
        }, "-=0.42")
        .to(".scroll-cue", { yPercent: 0, opacity: 1, duration: 0.72, ease: "expo.out" }, "-=0.58");
    }, root);

    return () => ctx.revert();
  }, [introActive, onIntroComplete]);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-nav, .hero-bottom-name, .hero-bottom-meta, .hero-overlay-tagline", {
        yPercent: 120,
        opacity: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1.18,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".scroll-cue", { opacity: 0, yPercent: -40, duration: 0.12 }, 0)
        .to(".hero-name-start", { xPercent: -22, opacity: 0.08, duration: 0.55 }, 0)
        .to(".hero-name-end", { xPercent: 22, opacity: 0.08, duration: 0.55 }, 0)
        .to(
          ".hero-image-shell",
          {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            marginInline: 0,
            duration: 1,
            overwrite: "auto",
          },
          0
        )
        .to(
          ".hero-image-inner",
          {
            scale: 1.16,
            yPercent: -16,
            duration: 1,
            overwrite: "auto",
          },
          0
        )
        .to(".hero-vignette", { opacity: 1, duration: 0.55 }, 0.38)
        .to(".hero-letter", { opacity: 0, yPercent: -35, duration: 0.3 }, 0.42)
        .to(".hero-descriptors", { opacity: 0, yPercent: -32, duration: 0.26 }, 0.44)
        .to(
          ".hero-nav, .hero-bottom-name, .hero-bottom-meta, .hero-overlay-tagline",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.05,
            ease: "power3.out",
          },
          0.7
        )
        .to(
          ".hero-image-inner",
          {
            yPercent: -28,
            scale: 1.22,
            duration: 0.55,
          },
          0.86
        )
        .to(
          ".hero-camera",
          {
            scale: 7.6,
            opacity: 0,
            transformOrigin: "68% 82%",
            duration: 0.92,
            ease: "expo.inOut",
          },
          1.12
        )
        .to(
          ".hero-image-shell",
          {
            opacity: 0,
            duration: 0.5,
            ease: "sine.inOut",
          },
          1.18
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero-section">
      <div className="hero-camera">
        <div className="hero-center ml-[0px] mr-[0px]">
          <div className="hero-title-wrap">
            <div className="hero-name-start hero-name">
              {firstName.map((letter, i) => (
                <span className="hero-letter pl-[6px] pr-[6px]" key={`${letter}-${i}`}>
                  {letter}
                </span>
              ))}
            </div>

            <div className="hero-image-shell">
              <div className="hero-image-inner">
                <img src={heroImage} alt="Rio de Janeiro em preto e branco" />
              </div>
              <div className="hero-vignette" />
            </div>

            <div className="hero-name-end hero-name">
              {lastName.map((letter, i) => (
                <span className="hero-letter ml-[0px] mr-[0px] pl-[6px] pr-[6px]" key={`${letter}-${i}`}>
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-descriptors" aria-label="Services and origin">
            {([
              ["CREATIVE DESIGN (UX/UI)", "hero-descriptor--service"],
              ["DEVELOPMENT SOLUTIONS",   "hero-descriptor--service"],
              ["inspired by Rio",         "hero-descriptor--origin"],
              ["Turn an idea into reality", "hero-descriptor--tagline"],
            ] as const).map(([text, cls]) => (
              <div className="hero-descriptor-clip" key={text}>
                <span className={`hero-descriptor-inner ${cls}`}>{text}</span>
              </div>
            ))}
          </div>
          <div className="scroll-cue">Scroll</div>
        </div>

        <div className="hero-overlay">
          <nav className="hero-nav">
            <Logo className="hero-logo" />
            <div className="hero-links">
              <FledgeLink href="#projects" label="Projects" />
              <FledgeLink href="#about" label="About" />
              <FledgeLink href="#contact" label="Contact" />
            </div>
          </nav>

          <p className="hero-overlay-tagline">inspired by Rio</p>

          <div className="hero-bottom">
            <h1 className="hero-bottom-name circular-text-reveal" data-text="Camila Lopes">Camila Lopes</h1>
            <p className="hero-bottom-meta">
              creative developer
              <br />
              front-end · ui motion · editorial web
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
