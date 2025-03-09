import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const isTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    if (isTouchDevice()) return;
    
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const updateHoverState = (hovering: boolean) => {
      setIsHovering(hovering);
    };
    
    // Track mouse movement
    document.addEventListener('mousemove', updateCursorPosition);
    
    // Handle interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => updateHoverState(true));
      element.addEventListener('mouseleave', () => updateHoverState(false));
    });
    
    // Hide when mouse leaves document
    document.addEventListener('mouseleave', () => setIsVisible(false));
    document.addEventListener('mouseenter', () => setIsVisible(true));
    
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseleave', () => setIsVisible(false));
      document.removeEventListener('mouseenter', () => setIsVisible(true));
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', () => updateHoverState(true));
        element.removeEventListener('mouseleave', () => updateHoverState(false));
      });
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '18px' : '12px', 
          height: isHovering ? '18px' : '12px',
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
      <div 
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '28px' : '36px', 
          height: isHovering ? '28px' : '36px',
          backgroundColor: 'hsla(var(--primary), 0.2)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s ease, height 0.3s ease, transform 0.3s ease, left 0.3s ease, top 0.3s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;
