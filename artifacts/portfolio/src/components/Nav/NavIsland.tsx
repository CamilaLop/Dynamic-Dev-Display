import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

const LINKS = [
  { label: "Works",   num: "01", href: "#projects" },
  { label: "About",   num: "02", href: "#about" },
  { label: "Contact", num: "03", href: "#contact" },
];

export function NavIsland() {
  const isOpenRef  = useRef(false);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);
  const btnRef     = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const expandW = Math.min(window.innerWidth * 0.88, 440);

    // Set collapsed initial state
    gsap.set(".ni-island", { width: 52 });
    gsap.set(".ni-wordmark", { opacity: 0, x: -6 });

    const tl = gsap.timeline({ paused: true })
      // Island pill expands
      .to(".ni-island", {
        width: expandW,
        duration: 0.6,
        ease: "back.out(2.2)",
      }, 0)
      // Wordmark slides + fades in
      .to(".ni-wordmark", {
        opacity: 1,
        x: 0,
        duration: 0.38,
        ease: "power2.out",
      }, 0.18)
      // Middle bar disappears
      .to(".ni-bar-mid", {
        opacity: 0,
        duration: 0.14,
        ease: "power2.in",
      }, 0)
      // Top bar → diagonal ↘
      .to(".ni-bar-top", {
        attr: { x1: 4, y1: 4, x2: 14, y2: 14 },
        duration: 0.3,
        ease: "power3.inOut",
      }, 0.04)
      // Bottom bar → diagonal ↗
      .to(".ni-bar-bot", {
        attr: { x1: 14, y1: 4, x2: 4, y2: 14 },
        duration: 0.3,
        ease: "power3.inOut",
      }, 0.04)
      // Backdrop fades in
      .to(".ni-backdrop", {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }, 0)
      // Panel scales + fades in from above
      .from(".ni-panel", {
        autoAlpha: 0,
        yPercent: -12,
        scale: 0.88,
        duration: 0.52,
        transformOrigin: "top center",
        ease: "back.out(1.9)",
      }, 0.1)
      // Links stagger up
      .from(".ni-link", {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.06,
      }, 0.24);

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  const toggle = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;

    isOpenRef.current = !isOpenRef.current;
    const open = isOpenRef.current;

    // Update a11y attrs
    if (btnRef.current) {
      btnRef.current.setAttribute("aria-expanded", String(open));
      btnRef.current.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    // Update link tabindex
    document.querySelectorAll<HTMLAnchorElement>(".ni-link").forEach((l) => {
      l.tabIndex = open ? 0 : -1;
    });

    if (open) {
      if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";
      tl.timeScale(1).play();
    } else {
      tl.eventCallback("onReverseComplete", () => {
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
      });
      tl.timeScale(1.6).reverse();
    }
  }, []);

  const close = useCallback(() => {
    if (isOpenRef.current) toggle();
  }, [toggle]);

  // Escape key closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpenRef.current) {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <>
      {/* ── Compact island pill ── */}
      <div className="ni-island" aria-label="Site navigation">
        <span className="ni-wordmark" aria-hidden="true">Camila Lopes</span>

        <button
          ref={btnRef}
          className="ni-btn"
          type="button"
          onClick={toggle}
          aria-expanded="false"
          aria-controls="ni-menu"
          aria-label="Open menu"
        >
          <div className="ni-btn-cont">
            <svg
              className="ni-icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <line className="ni-bar ni-bar-top" x1="3" y1="6"  x2="15" y2="6"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line className="ni-bar ni-bar-mid" x1="3" y1="9"  x2="15" y2="9"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line className="ni-bar ni-bar-bot" x1="3" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </button>
      </div>

      {/* ── Full-screen overlay ── */}
      <div
        ref={overlayRef}
        className="ni-overlay"
        id="ni-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{ pointerEvents: "none" }}
      >
        <div className="ni-backdrop" onClick={close} />

        <nav className="ni-panel" aria-label="Main navigation">
          {LINKS.map(({ label, num, href }) => (
            <a
              key={num}
              href={href}
              className="ni-link"
              tabIndex={-1}
              onClick={close}
            >
              <span className="ni-link-label">{label}</span>
              <span className="ni-link-num">{num}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
