import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let visible = false;

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");

    const tick = () => {
      cx += (mx - cx) * 0.09;
      cy += (my - cy) * 0.09;
      setX(cx);
      setY(cy);
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
    // nav links + tagline → cursor SHRINKS instead of enlarging
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

    // enlarge: everything interactive except nav/fledge links
    const INTERACTIVE = "a:not(.fledge-link):not(.hero-overlay-tagline), button, .experience-item, .work-card-dot, .footer-cta, .footer-link";
    // shrink: nav links and the big tagline
    const SHRINK = ".fledge-link, .hero-overlay-tagline";

    const attachListeners = () => {
      document.querySelectorAll<HTMLElement>(INTERACTIVE).forEach((node) => {
        if (node.dataset.cursorBound) return;
        node.dataset.cursorBound = "1";
        node.addEventListener("mouseenter", onEnterInteractive);
        node.addEventListener("mouseleave", onLeaveInteractive);
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

  return <div ref={cursorRef} className="c-cursor" aria-hidden="true" />;
}
