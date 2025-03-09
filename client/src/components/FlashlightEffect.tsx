import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface FlashlightEffectProps {
  children: React.ReactNode;
  isActive: boolean;
}

const FlashlightEffect: React.FC<FlashlightEffectProps> = ({ children, isActive }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for flashlight effect
  const flashlightAnimation = useSpring({
    opacity: isActive ? 1 : 0,
    config: { tension: 280, friction: 60 }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="flashlight-container" ref={containerRef}>
      {children}
      <animated.div 
        className={`flashlight-effect ${isActive ? 'active' : ''}`}
        style={{
          ...flashlightAnimation,
          '--x': `${mousePosition.x}px`,
          '--y': `${mousePosition.y}px`,
        } as React.CSSProperties}
      />
    </div>
  );
};

export default FlashlightEffect;