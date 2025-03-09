import React, { useState, useEffect, useRef } from 'react';

interface FlashlightEffectProps {
  children: React.ReactNode;
  isActive: boolean;
}

const FlashlightEffect: React.FC<FlashlightEffectProps> = ({ children, isActive }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    
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
  }, [isActive]);
  
  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div className="flashlight-container" ref={containerRef}>
      {children}
      <div 
        className="flashlight-effect"
        style={{
          '--x': `${mousePosition.x}px`,
          '--y': `${mousePosition.y}px`,
        } as React.CSSProperties}
      />
    </div>
  );
};

export default FlashlightEffect;