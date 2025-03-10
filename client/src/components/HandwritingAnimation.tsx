import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface HandwritingAnimationProps {
  text: string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  delay?: number;
  speed?: number;
  autoPlay?: boolean;
  onComplete?: () => void;
}

const HandwritingAnimation: React.FC<HandwritingAnimationProps> = ({
  text,
  className = '',
  color = '#000000',
  strokeWidth = 2,
  fontFamily = 'Caveat, cursive',
  fontSize = '2rem',
  delay = 0,
  speed = 1,
  autoPlay = true,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate a simple SVG path for a character based on its shape
  const generateCharPath = (char: string, x: number, y: number): string => {
    // Simple implementation - in production, you'd use a more sophisticated approach
    // This is a basic approximation to simulate handwriting paths
    if (char === ' ') {
      return '';
    }
    
    const charWidth = 20; // Approximate width per character
    
    if (char.match(/[il|]/)) {
      // Simple vertical strokes
      return `M ${x + charWidth/2} ${y - 20} L ${x + charWidth/2} ${y}`;
    } else if (char.match(/[_]/)) {
      // Simple horizontal strokes
      return `M ${x} ${y} L ${x + charWidth} ${y}`;
    } else if (char.match(/[oO0]/)) {
      // Circular characters
      return `M ${x + charWidth/2} ${y - 20} 
              C ${x + charWidth*1.2} ${y - 20}, ${x + charWidth*1.2} ${y + 5}, ${x + charWidth/2} ${y + 5} 
              C ${x - charWidth*0.2} ${y + 5}, ${x - charWidth*0.2} ${y - 20}, ${x + charWidth/2} ${y - 20}`;
    } else if (char.match(/[cC]/)) {
      // C-like shapes
      return `M ${x + charWidth} ${y - 20} 
              C ${x - charWidth*0.2} ${y - 20}, ${x - charWidth*0.2} ${y + 5}, ${x + charWidth} ${y + 5}`;
    } else {
      // Default zigzag path to simulate most characters
      return `M ${x} ${y - 10 + Math.random() * 5} 
              L ${x + charWidth/3} ${y - 15 + Math.random() * 5} 
              L ${x + charWidth*2/3} ${y - 5 + Math.random() * 5} 
              L ${x + charWidth} ${y + Math.random() * 5}`;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible';
    containerRef.current.appendChild(svg);
    svgRef.current = svg;
    
    // Container for paths
    const pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(pathGroup);
    
    // Create paths for each character
    const paths: SVGPathElement[] = [];
    let currentX = 10;
    const baseY = 30;
    
    Array.from(text).forEach((char, index) => {
      const pathData = generateCharPath(char, currentX, baseY);
      
      if (pathData) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', strokeWidth.toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('data-char', char);
        path.style.strokeLinecap = 'round';
        path.style.strokeLinejoin = 'round';
        
        pathGroup.appendChild(path);
        paths.push(path);
      }
      
      // Move to the next character position
      currentX += char === ' ' ? 10 : 20;
    });
    
    pathsRef.current = paths;
    
    // Adjust SVG viewBox to fit the content
    svg.setAttribute('viewBox', `0 0 ${currentX + 20} ${baseY + 20}`);
    
    // Create drawing animation
    const tl = gsap.timeline({
      paused: !autoPlay,
      delay,
      onComplete: () => {
        onComplete?.();
      }
    });
    
    // Set all paths to initially hidden state
    gsap.set(paths, { strokeDasharray: '100%', strokeDashoffset: '100%' });
    
    // Animate each path with staggered timing
    tl.to(paths, {
      strokeDashoffset: '0%',
      duration: 1 / speed,
      stagger: 0.1 / speed,
      ease: 'power1.inOut',
    });
    
    tlRef.current = tl;
    
    // Cleanup
    return () => {
      tl.kill();
    };
  }, [text, color, strokeWidth, delay, speed, autoPlay, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className={cn('handwriting-animation', className)}
      style={{ 
        fontFamily, 
        fontSize,
        lineHeight: 1.2,
        position: 'relative',
        height: fontSize,
      }}
    />
  );
};

export default HandwritingAnimation;