// src/components/ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 *
 * Usage:
 *   <ScrollToTop />
 *   // or for a scrollable container:
 *   <ScrollToTop containerSelector="main" topOffset={-80} smooth={false} />
 *
 * Props:
 *  - containerSelector: CSS selector for a scrolling container (optional).
 *    If provided, will call element.scrollTo(...) instead of window.scrollTo.
 *  - topOffset: number (pixels) to offset scroll (useful for sticky headers).
 *  - smooth: boolean to enable smooth scroll (default false).
 */
export default function ScrollToTop({
  containerSelector = null,
  topOffset = 0,
  smooth = true,
}) {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    // disable browser's automatic restoration so we control behavior
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch (e) {}

    const behavior = smooth ? "smooth" : "auto";

    const scrollWindow = (y = 0) => {
      // Try window first
      try {
        window.scrollTo({ top: y, left: 0, behavior });
        // also set document scrolls (some browsers)
        document.documentElement.scrollTop = y;
        document.body.scrollTop = y;
      } catch (err) {
        // fallback
        window.scrollTo(0, y);
      }
    };

    const scrollContainer = (el, y = 0) => {
      try {
        el.scrollTo({ top: y, left: 0, behavior });
      } catch (err) {
        el.scrollTop = y;
      }
    };

    const doScroll = () => {
      const offset = topOffset || 0;

      // If a container selector was provided, use that element
      if (containerSelector) {
        const el = document.querySelector(containerSelector);
        if (el) {
          scrollContainer(el, offset >= 0 ? offset : 0);
          return;
        }
      }

      // If there is a hash, try scrollIntoView for that id first
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          try {
            target.scrollIntoView({ behavior, block: "start" });
            // then apply offset (if sticky header overlaps)
            if (topOffset) {
              const cur = window.scrollY || window.pageYOffset;
              window.scrollTo({ top: cur + topOffset, behavior });
            }
            return;
          } catch (err) {
            // continue to scroll to top fallback
          }
        }
      }

      // Use double requestAnimationFrame to ensure layout stabilised (good for page transitions)
      requestAnimationFrame(() => requestAnimationFrame(() => scrollWindow(offset)));
    };

    // run the scroll
    doScroll();

    // also in case a page has delayed rendering/animations, try again shortly
    const t = setTimeout(doScroll, 160);

    // cleanup
    return () => clearTimeout(t);
    // NOTE: include `key` to run also for replace navigations (some browsers)
  }, [pathname, hash, key, containerSelector, topOffset, smooth]);

  return null;
}
