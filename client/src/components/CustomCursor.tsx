import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface CursorState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  mixBlendMode: 'normal' | 'difference' | 'multiply' | 'screen';
}

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 0,
    mixBlendMode: 'difference',
  });
  
  useEffect(() => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);
    
    // Smooth cursor animation
    const renderCursor = () => {
      gsap.set(cursorDot, {
        x: cursorState.x,
        y: cursorState.y,
        opacity: cursorState.opacity,
      });
      
      gsap.to(cursorRing, {
        x: cursorState.x,
        y: cursorState.y,
        scale: cursorState.scale,
        opacity: cursorState.opacity,
        mixBlendMode: cursorState.mixBlendMode,
        duration: 0.15,
        ease: 'power2.out',
      });
    };
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setCursorState(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
      }));
      
      renderCursor();
    };
    
    // Handle mouse hover over links and buttons
    const handleLinkHover = () => {
      setCursorState(prev => ({
        ...prev,
        scale: 2.5,
      }));
    };
    
    const handleLinkLeave = () => {
      setCursorState(prev => ({
        ...prev,
        scale: 1,
      }));
    };
    
    // Handle mouse leaving the window
    const handleMouseLeave = () => {
      setCursorState(prev => ({
        ...prev,
        opacity: 0,
      }));
    };
    
    // Handle mouse entering the window
    const handleMouseEnter = () => {
      setCursorState(prev => ({
        ...prev,
        opacity: 1,
      }));
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleLinkHover);
      el.addEventListener('mouseleave', handleLinkLeave);
    });
    
    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
      .cursor-dot {
        position: fixed;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        will-change: transform;
      }
      
      .cursor-ring {
        position: fixed;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        will-change: transform;
        transition: all 0.1s ease-out;
      }
      
      @media (max-width: 768px) {
        .cursor-dot, .cursor-ring {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
      
      document.body.removeChild(cursorDot);
      document.body.removeChild(cursorRing);
      document.head.removeChild(style);
    };
  }, []);
  
  // This component doesn't render any visible elements itself
  return null;
};

export default CustomCursor;