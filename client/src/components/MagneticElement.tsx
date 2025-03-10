import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  damping?: number;
  interactive?: boolean;
}

const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  className = '',
  strength = 0.5,
  damping = 0.1,
  interactive = true,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);
  const isHovering = useRef(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const animation = useRef<gsap.core.Tween | null>(null);

  // Update bounding box on resize
  useEffect(() => {
    const updateBounds = () => {
      if (elementRef.current) {
        boundingRef.current = elementRef.current.getBoundingClientRect();
      }
    };

    // Initialize bounds
    updateBounds();

    // Update bounds on resize
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
      
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
      
      if (animation.current) {
        animation.current.kill();
      }
    };
  }, []);

  // Handle mouse interaction
  useEffect(() => {
    if (!interactive) return;
    
    const element = elementRef.current;
    if (!element) return;

    // Mouse enter handler
    const handleMouseEnter = () => {
      isHovering.current = true;
      if (boundingRef.current) {
        gsap.to(element, {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      isHovering.current = false;
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!boundingRef.current || !isHovering.current) return;

      const { left, top, width, height } = boundingRef.current;
      
      // Calculate relative position (0 to 1)
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      setMousePosition({ x, y });
    };

    // Add event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    // Animate magnetic effect
    const animateMagnetism = () => {
      if (isHovering.current && boundingRef.current) {
        const { width, height } = boundingRef.current;
        
        // Calculate target position based on mouse position and element size
        const targetX = mousePosition.x * width * strength;
        const targetY = mousePosition.y * height * strength;
        
        // Create smooth animation to follow mouse
        animation.current = gsap.to(element, {
          x: targetX,
          y: targetY,
          duration: damping,
          ease: 'power2.out',
          overwrite: true,
        });
      }
      
      raf.current = requestAnimationFrame(animateMagnetism);
    };
    
    raf.current = requestAnimationFrame(animateMagnetism);

    // Clean up
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
      
      if (animation.current) {
        animation.current.kill();
      }
    };
  }, [interactive, strength, damping, mousePosition]);

  return (
    <div
      ref={elementRef}
      className={`magnetic-element ${className}`}
      style={{ display: 'inline-block', transform: 'translate3d(0, 0, 0)' }}
    >
      {children}
    </div>
  );
};

export default MagneticElement;