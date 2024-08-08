import { useEffect, useCallback, useRef, MutableRefObject } from 'react';

export const useSmoothScrollOnView = (selector: string): MutableRefObject<HTMLDivElement | null> => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleView = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      observer.current = new IntersectionObserver(handleView, {
        threshold: 0.1
      });

      const elements = containerRef.current.querySelectorAll(selector);
      elements.forEach(element => observer.current!.observe(element));

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [handleView, selector]);

  return containerRef;
};
