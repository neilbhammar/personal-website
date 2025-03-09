import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize the smooth scrolling effect
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Connect Lenis with GSAP's ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Update scroll position each frame
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Start the animation frame
  requestAnimationFrame(raf);

  return lenis;
}