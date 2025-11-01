
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  // Disable browser's automatic scroll restoration so we control it
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll before paint on route changes for a snappy experience
  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // Cross-browser fallbacks
      document.documentElement.scrollTop = 0;
      (document.scrollingElement || document.body).scrollTop = 0;
    };

    // Run multiple times to beat late layout or restoration
    scrollToTop();
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 0);
  }, [location.pathname, location.key]);

  return null;
};

export default ScrollToTop;
