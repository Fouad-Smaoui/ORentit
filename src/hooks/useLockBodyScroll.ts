import { useEffect } from 'react';

/**
 * Locks page-level scrolling while `locked` is true. Used by pages that
 * are meant to behave like a self-contained, single-viewport panel
 * rather than a normally scrolling webpage.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [locked]);
}
