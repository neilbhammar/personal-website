import { useEffect, useRef } from 'react';

export interface ScrollRevealOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, root = null, rootMargin = '0px', once = true } = options;
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Clean up if there's an existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // If once is true, unobserve after revealing
            if (once) {
              observerRef.current?.unobserve(entry.target);
            }
          } else if (!once) {
            // If not once, remove active class when out of view
            entry.target.classList.remove('active');
          }
        });
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );
    
    // Find all elements with 'reveal' class
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => {
      observerRef.current?.observe(el);
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, once]);
}
