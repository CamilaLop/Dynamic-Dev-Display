import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;

    const xDot  = gsap.quickSetter(dot,  "x", "px");
    const yDot  = gsap.quickSetter(dot,  "y", "px");
    const xRing = gsap.quickSetter(ring, "x", "px");
    const yRing = gsap.quickSetter(ring, "y", "px");

    // RAF loop — ring lags behind dot
    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      xRing(rx);
      yRing(ry);
    };
    gsap.ticker.add(tick);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      xDot(mx);
      yDot(my);

      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
    };

    // Expand ring on interactive elements
    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.3, ease: "power2.out", overwrite: true });
      gsap.to(dot,  { scale: 0.4,              duration: 0.3, ease: "power2.out", overwrite: true });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: true });
      gsap.to(dot,  { scale: 1,             duration: 0.3, ease: "power2.out", overwrite: true });
    };

    // Hide cursor when leaving window
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnter = () => { if (visible) gsap.to([dot, ring], { opacity: 1, duration: 0.3 }); };

    document.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseleave",  onLeave);
    document.addEventListener("mouseenter",  onEnter);

    // Delegate interactive hover to common elements
    const addDelegated = (selector: string) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    };

    addDelegated("a, button, .experience-item, .work-card-dot, .footer-cta");

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      addDelegated("a, button, .experience-item, .work-card-dot, .footer-cta");
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="c-dot"  aria-hidden="true" />
      <div ref={ringRef} className="c-ring" aria-hidden="true" />
    </>
  );
}
