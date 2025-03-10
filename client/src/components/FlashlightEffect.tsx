import { useEffect, useState, useRef } from 'react';

interface FlashlightEffectProps {
  children: React.ReactNode;
  isActive: boolean;
}

const FlashlightEffect: React.FC<FlashlightEffectProps> = ({ 
  children,
  isActive 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [flashlightSize, setFlashlightSize] = useState(150);
  const [documentHeight, setDocumentHeight] = useState(0);
  
  // Update document height when loaded and on resize
  useEffect(() => {
    const updateHeight = () => {
      setDocumentHeight(document.documentElement.scrollHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Handle mouse movement to update flashlight position
  useEffect(() => {
    if (!isActive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY + window.scrollY
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive]);

  return (
    <div className="relative" ref={containerRef}>
      {children}
      
      {isActive && (
        <div 
          className="fixed top-0 left-0 w-full pointer-events-none transition-opacity duration-700 z-[1000]"
          style={{
            height: `${documentHeight}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            maskImage: `radial-gradient(circle ${flashlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle ${flashlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
          }}
        />
      )}
    </div>
  );
};

export default FlashlightEffect;