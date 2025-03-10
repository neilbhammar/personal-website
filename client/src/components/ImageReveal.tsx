import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  revealDirection?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
  threshold?: number;
  maskColor?: string;
  hoverEffect?: boolean;
  children?: React.ReactNode;
}

const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  revealDirection = 'left',
  delay = 0,
  duration = 1.2,
  threshold = 0.3,
  maskColor = '#ffffff',
  hoverEffect = true,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Create the initial clip-path value based on reveal direction
  const getInitialClipPath = () => {
    switch (revealDirection) {
      case 'left':
        return 'inset(0 100% 0 0)';
      case 'right':
        return 'inset(0 0 0 100%)';
      case 'top':
        return 'inset(100% 0 0 0)';
      case 'bottom':
        return 'inset(0 0 100% 0)';
      default:
        return 'inset(0 100% 0 0)';
    }
  };

  // Set up reveal animation
  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !overlayRef.current || !isLoaded) return;

    // Ensure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.timeline({
      delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: `top ${100 - threshold * 100}%`,
        once: true,
      },
      onComplete: () => setIsRevealed(true),
    });

    // Initial states
    gsap.set(imageRef.current, {
      clipPath: getInitialClipPath(),
      webkitClipPath: getInitialClipPath(),
    });

    gsap.set(overlayRef.current, {
      autoAlpha: 1,
      [revealDirection]: 0,
    });

    // Reveal animation
    animation
      .to(
        imageRef.current,
        {
          clipPath: 'inset(0 0 0 0)',
          webkitClipPath: 'inset(0 0 0 0)',
          ease: 'power2.inOut',
          duration,
        },
        0
      )
      .to(
        overlayRef.current,
        {
          [revealDirection]: '100%',
          ease: 'power2.inOut',
          duration: duration * 0.8,
        },
        duration * 0.2
      );

    return () => {
      if (animation) {
        animation.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [isLoaded, revealDirection, delay, duration, threshold]);

  // Hover effect setup
  useEffect(() => {
    if (!hoverEffect || !isRevealed || !imageRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power1.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'power1.out',
      });
    };

    const container = containerRef.current;
    container?.addEventListener('mouseenter', handleMouseEnter);
    container?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container?.removeEventListener('mouseenter', handleMouseEnter);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoverEffect, isRevealed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'image-reveal-container relative overflow-hidden',
        className
      )}
    >
      <div className="relative overflow-hidden w-full h-full">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover"
          style={{ clipPath: getInitialClipPath() }}
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ backgroundColor: maskColor }}
        ></div>
      </div>
      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ImageReveal;