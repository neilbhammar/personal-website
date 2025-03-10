import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollerProps {
  children: React.ReactNode;
  options?: {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  };
}

const SmoothScroller: React.FC<SmoothScrollerProps> = ({
  children,
  options = {},
}) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Default options with custom overrides
    const lenisOptions = {
      duration: options.duration || 1.2,
      easing: options.easing || ((t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: options.orientation || 'vertical',
      gestureOrientation: options.gestureOrientation || 'vertical',
      smoothWheel: options.smoothWheel !== undefined ? options.smoothWheel : true,
      smoothTouch: options.smoothTouch !== undefined ? options.smoothTouch : false,
      wheelMultiplier: options.wheelMultiplier || 1,
      touchMultiplier: options.touchMultiplier || 2,
    };

    // Initialize Lenis for smooth scrolling
    const lenisInstance = new Lenis(lenisOptions);
    setLenis(lenisInstance);

    // Connect Lenis scroll to ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Set up the RAF loop for Lenis
    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    
    requestAnimationFrame(raf);

    // Set up ScrollTrigger defaults
    ScrollTrigger.defaults({
      scroller: document.documentElement,
    });

    // Update ScrollTrigger when the page is loaded
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      lenisInstance.destroy();
      
      // Clean up all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, [options]);

  // Methods to expose from Lenis if needed
  const scrollTo = (target: string | HTMLElement | number, options = {}) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  };

  return <>{children}</>;
};

export default SmoothScroller;