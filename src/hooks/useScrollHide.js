import { useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 8;

export function useScrollHide() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastTouchY = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    function updateVisible(show) {
      setVisible(show);
    }

    function handleWheel(e) {
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
      updateVisible(e.deltaY < 0); // deltaY < 0 = scrolling up
    }

    function handleTouchStart(e) {
      lastTouchY.current = e.touches[0]?.clientY ?? 0;
    }
    function handleTouchMove(e) {
      const touchY = e.touches[0]?.clientY ?? lastTouchY.current;
      const delta = touchY - lastTouchY.current;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      updateVisible(delta > 0); // finger moving down = content scrolling up
      lastTouchY.current = touchY;
    }

    function handleScroll() {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop ?? 0;
      if (scrollY <= 0) {
        updateVisible(true);
        lastScrollY.current = scrollY;
        return;
      }
      const delta = scrollY - lastScrollY.current;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      updateVisible(delta < 0);
      lastScrollY.current = scrollY;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        handleScroll();
        tickingRef.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return visible;
}
