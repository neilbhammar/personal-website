import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  type?: 'char' | 'word' | 'line';
  bold?: boolean;
  color?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  children?: React.ReactNode;
  inline?: boolean;
  highlightWords?: string[];
  hoverEffect?: boolean;
  splitNewlines?: boolean;
}

const RevealText = ({
  text,
  className = '',
  speed = 0.05,
  delay = 0,
  type = 'char',
  bold = false,
  color,
  style,
  onComplete,
  children,
  inline = false,
  highlightWords = [],
  hoverEffect = true,
  splitNewlines = true,
}: RevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const tlRef = useRef<GSAPTimeline | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create empty container
    containerRef.current.innerHTML = '';
    elementsRef.current = [];

    // Process text based on the split type
    let elements: HTMLElement[] = [];
    const splitText = splitNewlines ? text.split('\n') : [text];

    splitText.forEach((line, lineIndex) => {
      const lineContainer = document.createElement('div');
      lineContainer.className = 'inline-block';

      if (type === 'char') {
        // Split by characters
        [...line].forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.classList.add('reveal-char', 'inline-block', 'opacity-0');
          if (char === ' ') span.classList.add('whitespace');
          lineContainer.appendChild(span);
          elements.push(span);
        });
      } else if (type === 'word') {
        // Split by words
        line.split(' ').forEach((word, i, arr) => {
          const wordSpan = document.createElement('span');
          wordSpan.textContent = word;
          wordSpan.classList.add('reveal-word', 'inline-block', 'opacity-0');
          
          // Add highlight to words in the highlightWords array
          if (highlightWords.includes(word)) {
            wordSpan.classList.add('text-primary', 'hover:underline');
          }
          
          // Add hover effect
          if (hoverEffect) {
            wordSpan.classList.add('hover:text-primary', 'transition-colors', 'duration-300');
          }
          
          lineContainer.appendChild(wordSpan);
          elements.push(wordSpan);
          
          // Add space after each word except the last one
          if (i < arr.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;';
            space.classList.add('whitespace');
            lineContainer.appendChild(space);
          }
        });
      } else if (type === 'line') {
        // Each line as a unit
        lineContainer.textContent = line;
        lineContainer.classList.add('reveal-line', 'opacity-0');
        elements.push(lineContainer);
      }

      containerRef.current?.appendChild(lineContainer);
      
      // Add line break after each line except the last one
      if (lineIndex < splitText.length - 1 && splitNewlines) {
        const br = document.createElement('br');
        containerRef.current?.appendChild(br);
      }
    });

    elementsRef.current = elements;

    // Create animation with GSAP
    tlRef.current = gsap.timeline({ paused: true, delay });
    tlRef.current.to(elements, {
      opacity: 1,
      y: 0,
      stagger: speed,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        setRevealed(true);
        onComplete?.();
      }
    });

    // Set initial state
    gsap.set(elements, { opacity: 0, y: '0.25em' });

    // Start animation
    tlRef.current.play();

    return () => {
      tlRef.current?.kill();
    };
  }, [text, speed, delay, type, highlightWords, hoverEffect, onComplete, splitNewlines]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      ref={containerRef}
      className={cn(
        'reveal-text',
        bold && 'font-bold',
        className
      )}
      style={{
        ...style,
        color: color,
      }}
    />
  );
};

export default RevealText;