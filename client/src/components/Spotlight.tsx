import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface SpotlightProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  intensity?: number;
  followCursor?: boolean;
  delay?: number;
}

// This component creates an advanced spotlight effect that follows cursor or moves on its own
const Spotlight: React.FC<SpotlightProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.15)',
  size = 300,
  intensity = 0.6,
  followCursor = true,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial setup
  useEffect(() => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }

    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      
      // Set initial position
      if (!followCursor) {
        setPosition({ 
          x: width / 2, 
          y: height / 2 
        });
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [delay, followCursor]);

  // Autonomous movement when not following cursor
  useEffect(() => {
    if (!followCursor && isVisible) {
      let angle = 0;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.2;
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const speed = 0.001;

      const animate = () => {
        angle += speed;
        const newX = centerX + Math.cos(angle) * radius;
        const newY = centerY + Math.sin(angle) * radius;
        setPosition({ x: newX, y: newY });
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [followCursor, isVisible, dimensions]);

  // Handle cursor movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (followCursor && containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setPosition({ x, y });
    }
  };

  // Spotlight style
  const spotlightStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, ${color} 0%, transparent ${100 * intensity}%)`,
    opacity: isVisible ? 1 : 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 1s ease',
    zIndex: 1,
  };

  return (
    <div 
      ref={containerRef}
      className="spotlight-container relative" 
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      <div className="spotlight-content relative z-10">{children}</div>
      <div ref={spotlightRef} style={spotlightStyle} />
    </div>
  );
};

export default Spotlight;