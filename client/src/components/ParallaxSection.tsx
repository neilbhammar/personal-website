import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1, where 1 is maximum parallax effect
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: { start: string; end: string }; // e.g. { start: 'top bottom', end: 'bottom top' }
}

const ParallaxSection = ({
  children,
  className,
  intensity = 0.3,
  direction = 'up',
  threshold = { start: 'top bottom', end: 'bottom top' },
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    
    // Calculate movement amount based on direction and intensity
    let xPercent = 0;
    let yPercent = 0;
    const movementDistance = 100 * intensity; // This will be a percentage
    
    switch (direction) {
      case 'up':
        yPercent = movementDistance;
        break;
      case 'down':
        yPercent = -movementDistance;
        break;
      case 'left':
        xPercent = movementDistance;
        break;
      case 'right':
        xPercent = -movementDistance;
        break;
      default:
        yPercent = movementDistance;
    }
    
    // Create the parallax animation
    gsap.fromTo(
      contentRef.current,
      {
        y: direction === 'up' || direction === 'down' ? `${yPercent}%` : 0,
        x: direction === 'left' || direction === 'right' ? `${xPercent}%` : 0,
      },
      {
        y: 0,
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: threshold.start,
          end: threshold.end,
          scrub: true,
        },
      }
    );
    
    return () => {
      // Clean up ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [direction, intensity, threshold]);
  
  return (
    <div ref={sectionRef} className={cn('overflow-hidden', className)}>
      <div ref={contentRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;