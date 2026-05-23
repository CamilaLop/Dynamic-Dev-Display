import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el    = cursorRef.current;
    const label = labelRef.current;
    if (!el) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let visible = false;

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");

    const setLabelX = label ? gsap.quickSetter(label, "x", "px") : null;
    const setLabelY = label ? gsap.quickSetter(label, "y", "px") : null;

    const tick = () => {
      cx += (mx - cx) * 0.09;
      cy += (my - cy) * 0.09;
      setX(cx);
      setY(cy);
      if (setLabelX && setLabelY) {
        setLabelX(cx);
        setLabelY(cy + 34);
      }
    };
    gsap.ticker.add(tick);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        gsap.to(el, { opacity: 1, duration: 0.35 });
      }
    };

    const onEnterInteractive = () => {
      gsap.to(el, { scale: 2.6, duration: 0.38, ease: "power2.out", overwrite: true });
    };
    const onLeaveInteractive = () => {
      gsap.to(el, { scale: 1, duration: 0.38, ease: "power2.out", overwrite: true });
    };

    const onEnterExplore = () => {
      gsap.to(el, { scale: 2.8, duration: 0.38, ease: "power2.out", overwrite: true });
      if (label) gsap.to(label, { opacity: 1, duration: 0.22, ease: "power2.out" });
    };
    const onLeaveExplore = () => {
      gsap.to(el, { scale: 1, duration: 0.38, ease: "power2.out", overwrite: true });
      if (label) gsap.to(label, { opacity: 0, duration: 0.18 });
    };

    const onEnterShrink = () => {
      gsap.to(el, { scale: 0.28, duration: 0.35, ease: "power2.out", overwrite: true });
    };
    const onLeaveShrink = () => {
      gsap.to(el, { scale: 1, duration: 0.35, ease: "power2.out", overwrite: true });
    };
    const onLeaveWindow = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const onEnterWindow = () => { if (visible) gsap.to(el, { opacity: 1, duration: 0.3 }); };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    // enlarge: interactive elements (excluding experience-item — handled by EXPLORE)
    const INTERACTIVE = "a:not(.fledge-link):not(.hero-overlay-tagline), button, .work-card-dot, .footer-cta, .footer-link";
    const EXPLORE_SEL  = ".experience-item";
    const SHRINK       = ".fledge-link, .hero-overlay-tagline";

    const attachListeners = () => {
      document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach((node) => {
        if (node.dataset.cursorBound) return;
        node.dataset.cursorBound = "1";
        node.addEventListener("mouseenter", onEnterInteractive);
        node.addEventListener("mouseleave", onLeaveInteractive);
      });
      document.querySelectorAll<HTMLElement>(EXPLORE_SEL).forEach((node) => {
        if (node.dataset.cursorExploreBound) return;
        node.dataset.cursorExploreBound = "1";
        node.addEventListener("mouseenter", onEnterExplore);
        node.addEventListener("mouseleave", onLeaveExplore);
      });
      document.querySelectorAll<HTMLElement>(SHRINK).forEach((node) => {
        if (node.dataset.cursorShrinkBound) return;
        node.dataset.cursorShrinkBound = "1";
        node.addEventListener("mouseenter", onEnterShrink);
        node.addEventListener("mouseleave", onLeaveShrink);
      });
    };
    attachListeners();

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="c-cursor" aria-hidden="true" />
      <span ref={labelRef} className="c-cursor-label" aria-hidden="true">EXPLORE</span>
    </>
  );
}
