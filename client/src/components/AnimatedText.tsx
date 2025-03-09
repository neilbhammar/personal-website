import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  triggerOnce?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  inline?: boolean;
  onComplete?: () => void;
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  duration = 0.5,
  stagger = 0.02,
  triggerOnce = true,
  as = 'p',
  inline = false,
  onComplete,
}: SplitTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  
  const splitText = useCallback(() => {
    if (!textRef.current) return;
    
    // Clear any existing animation
    if (timeline.current) {
      timeline.current.kill();
    }
    
    const text = textRef.current;
    const words = children.split(' ');
    
    // Clear previous content
    text.innerHTML = '';
    
    // Create word and character spans
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word relative inline-block';
      
      // Create individual character spans
      Array.from(word).forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char relative inline-block opacity-0';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });
      
      text.appendChild(wordSpan);
      
      // Add space after each word except the last one
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'whitespace';
        space.innerHTML = '&nbsp;';
        text.appendChild(space);
      }
    });
    
    // Get all character spans for animation
    const chars = text.querySelectorAll('.char');
    
    // Create animation timeline
    timeline.current = gsap.timeline({
      delay,
      onComplete: () => {
        setHasAnimated(true);
        if (onComplete) onComplete();
      }
    });
    
    // Animate each character
    timeline.current.fromTo(
      chars,
      { 
        y: '1em',
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration,
        stagger,
        ease: 'power2.out',
      }
    );
  }, [children, delay, duration, stagger, onComplete]);
  
  useEffect(() => {
    // Initial animation
    if (!hasAnimated || !triggerOnce) {
      splitText();
    }
    
    return () => {
      // Cleanup animation on unmount
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [splitText, hasAnimated, triggerOnce, children]);
  
  const Component = as;
  
  return (
    <Component
      className={cn('animated-text', className, inline ? 'inline' : 'block')}
      ref={textRef}
    />
  );
}

export default AnimatedText;