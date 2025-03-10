import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  inline?: boolean;
  onComplete?: () => void;
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  duration = 0.7,
  stagger = 0.03,
  as: Component = 'p',
  inline = false,
  onComplete,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Create and run the animation when component mounts
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isAnimated) return;

    // Manual text splitting
    container.innerHTML = '';
    const chars: HTMLSpanElement[] = [];

    Array.from(children).forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'animated-char inline-block';
      container.appendChild(span);
      chars.push(span);
    });

    charsRef.current = chars;

    // Animation with GSAP
    const timeline = gsap.timeline({
      delay,
      onComplete: () => {
        setIsAnimated(true);
        onComplete?.();
      }
    });

    // Set initial state
    gsap.set(chars, {
      y: 20,
      opacity: 0,
      rotationX: -45,
    });

    // Animate with stagger
    timeline.to(chars, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration,
      stagger,
      ease: 'back.out',
    });

    tl.current = timeline;

    return () => {
      if (tl.current) {
        tl.current.kill();
      }
    };
  }, [children, delay, duration, stagger, isAnimated, onComplete]);

  // Set container styles
  const containerStyle = inline 
    ? { display: 'inline-block', ...inline && { whiteSpace: 'nowrap' }}
    : {};

  return (
    <Component
      ref={containerRef}
      className={cn('animated-text overflow-hidden', className)}
      style={containerStyle}
    >
      {children}
    </Component>
  );
}

export default AnimatedText;