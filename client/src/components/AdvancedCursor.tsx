import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AdvancedCursorProps {
  size?: number;
  color?: string;
  mixBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
  delay?: number;
  trailCount?: number;
  pulseOnClick?: boolean;
  hideNativeCursor?: boolean;
  showOnMobile?: boolean;
  hoverScale?: number;
}

const AdvancedCursor: React.FC<AdvancedCursorProps> = ({
  size = 16,
  color = 'rgba(255, 255, 255, 0.5)',
  mixBlendMode = 'exclusion',
  delay = 10,
  trailCount = 5,
  pulseOnClick = true,
  hideNativeCursor = true,
  showOnMobile = false,
  hoverScale = 3,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const clientPosition = useRef({ x: 0, y: 0 });
  const isMobileDevice = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const raf = useRef<number | null>(null);

  // Effect for cursor creation and animation
  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      isMobileDevice.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Don't show custom cursor on mobile devices unless specified
      if (isMobileDevice.current && !showOnMobile) {
        setIsVisible(false);
        return true;
      }
      return false;
    };

    if (checkMobile()) return;

    // Create cursor and trails elements
    const createElements = () => {
      if (!document.body) return;

      // Create cursor container
      const cursorContainer = document.createElement('div');
      cursorContainer.className = 'cursor-container';
      document.body.appendChild(cursorContainer);

      // Create main cursor dot
      const cursorDot = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      cursorDot.style.width = `${size}px`;
      cursorDot.style.height = `${size}px`;
      cursorDot.style.backgroundColor = color;
      cursorDot.style.borderRadius = '50%';
      cursorDot.style.position = 'fixed';
      cursorDot.style.pointerEvents = 'none';
      cursorDot.style.zIndex = '9999';
      cursorDot.style.transform = 'translate(-50%, -50%)';
      cursorDot.style.mixBlendMode = mixBlendMode;
      cursorDot.style.opacity = '0';
      cursorDot.style.transition = 'opacity 0.3s ease';
      cursorContainer.appendChild(cursorDot);
      cursorRef.current = cursorDot;

      // Create cursor outline
      const cursorOutline = document.createElement('div');
      cursorOutline.className = 'cursor-outline';
      cursorOutline.style.width = `${size * 2.5}px`;
      cursorOutline.style.height = `${size * 2.5}px`;
      cursorOutline.style.border = `1px solid ${color}`;
      cursorOutline.style.borderRadius = '50%';
      cursorOutline.style.position = 'fixed';
      cursorOutline.style.pointerEvents = 'none';
      cursorOutline.style.zIndex = '9998';
      cursorOutline.style.transform = 'translate(-50%, -50%)';
      cursorOutline.style.mixBlendMode = mixBlendMode;
      cursorOutline.style.opacity = '0';
      cursorOutline.style.transition = 'opacity 0.3s ease';
      cursorContainer.appendChild(cursorOutline);
      cursorOutlineRef.current = cursorOutline;

      // Create cursor trails
      trailsRef.current = [];
      for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.width = `${size * 0.6}px`;
        trail.style.height = `${size * 0.6}px`;
        trail.style.backgroundColor = color;
        trail.style.borderRadius = '50%';
        trail.style.position = 'fixed';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9997';
        trail.style.transform = 'translate(-50%, -50%)';
        trail.style.mixBlendMode = mixBlendMode;
        trail.style.opacity = `${0.4 - (i * 0.4) / trailCount}`;
        cursorContainer.appendChild(trail);
        trailsRef.current.push(trail);
      }

      // Hide native cursor if needed
      if (hideNativeCursor) {
        document.documentElement.style.cursor = 'none';
        const style = document.createElement('style');
        style.textContent = `
          a, button, .interactive, [role="button"] { cursor: none !important; }
        `;
        document.head.appendChild(style);
      }
    };

    createElements();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      clientPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      if (!isVisible) {
        setIsVisible(true);
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
        if (cursorOutlineRef.current) cursorOutlineRef.current.style.opacity = '1';
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      setIsVisible(false);
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (cursorOutlineRef.current) cursorOutlineRef.current.style.opacity = '0';
    };

    // Mouse down handler
    const handleMouseDown = () => {
      setIsClicking(true);
      
      if (pulseOnClick && cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          scale: 0.8,
          duration: 0.15,
          ease: 'power2.out',
        });
      }
    };

    // Mouse up handler
    const handleMouseUp = () => {
      setIsClicking(false);
      
      if (pulseOnClick && cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    // Interactive element hover
    const handleInteractiveEnter = () => {
      setIsHovering(true);
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: hoverScale,
          opacity: 0.5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      
      if (cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          scale: hoverScale * 0.8,
          opacity: 0.2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Interactive element leave
    const handleInteractiveLeave = () => {
      setIsHovering(false);
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      
      if (cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Update cursor position
    const updateCursor = () => {
      raf.current = requestAnimationFrame(updateCursor);
      
      if (!isVisible) return;
      
      // Main cursor dot follows mouse exactly
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: clientPosition.current.x,
          y: clientPosition.current.y,
        });
      }
      
      // Cursor outline follows with slight delay
      if (cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          x: clientPosition.current.x,
          y: clientPosition.current.y,
          duration: 0.15,
          ease: 'power2.out',
        });
      }
      
      // Trails follow with increasing delay
      trailsRef.current.forEach((trail, index) => {
        gsap.to(trail, {
          x: clientPosition.current.x,
          y: clientPosition.current.y,
          duration: 0.3 + (index * 0.05),
          ease: 'power2.out',
        });
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleInteractiveEnter);
      el.addEventListener('mouseleave', handleInteractiveLeave);
    });

    // Start animation loop
    raf.current = requestAnimationFrame(updateCursor);

    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleInteractiveEnter);
        el.removeEventListener('mouseleave', handleInteractiveLeave);
      });
      
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
      
      if (document.querySelector('.cursor-container')) {
        document.body.removeChild(document.querySelector('.cursor-container')!);
      }
      
      if (hideNativeCursor) {
        document.documentElement.style.cursor = '';
      }
    };
  }, [size, color, mixBlendMode, delay, trailCount, pulseOnClick, hideNativeCursor, showOnMobile, hoverScale]);

  // This component doesn't render anything directly in the DOM
  return null;
};

export default AdvancedCursor;