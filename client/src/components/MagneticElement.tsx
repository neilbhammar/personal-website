import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface MagneticElementProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  damping?: number;
  interactive?: boolean;
}

const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  className,
  strength = 0.5,
  damping = 0.1,
  interactive = true,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation properties
  const boundingClientRect = useRef<DOMRect | null>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  
  // Mouse enter handler
  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    
    if (elementRef.current) {
      // Store the element dimensions for calculations
      boundingClientRect.current = elementRef.current.getBoundingClientRect();
    }
  };
  
  // Mouse leave handler
  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    
    // Reset position and rotation when mouse leaves
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  };
  
  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered || !interactive || !boundingClientRect.current) return;
    
    // Calculate center point of the element
    const centerX = boundingClientRect.current.left + boundingClientRect.current.width / 2;
    const centerY = boundingClientRect.current.top + boundingClientRect.current.height / 2;
    
    // Calculate mouse distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate normalized distances (from -1 to 1)
    const normalizedX = distanceX / (boundingClientRect.current.width / 2);
    const normalizedY = distanceY / (boundingClientRect.current.height / 2);
    
    // Calculate target position and rotation based on distance
    targetPosition.current = {
      x: normalizedX * strength * 15,
      y: normalizedY * strength * 15,
    };
    
    targetRotation.current = {
      x: -normalizedY * strength * 10,
      y: normalizedX * strength * 10,
    };
  };
  
  // Animation effect
  useEffect(() => {
    if (!interactive) return;
    
    let rafId: number;
    let currentX = 0;
    let currentY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    
    const animate = () => {
      // Calculate new position with damping
      currentX += (targetPosition.current.x - currentX) * damping;
      currentY += (targetPosition.current.y - currentY) * damping;
      currentRotationX += (targetRotation.current.x - currentRotationX) * damping;
      currentRotationY += (targetRotation.current.y - currentRotationY) * damping;
      
      // Apply the transforms
      if (elementRef.current) {
        gsap.set(elementRef.current, {
          x: currentX,
          y: currentY,
          rotationX: currentRotationX,
          rotationY: currentRotationY,
        });
      }
      
      // Continue animation
      rafId = requestAnimationFrame(animate);
    };
    
    // Start animation if hovered
    if (isHovered) {
      animate();
    }
    
    // Cleanup animation frame on unmount or when hover state changes
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isHovered, damping, interactive]);
  
  return (
    <div
      ref={elementRef}
      className={cn('magnetic-element', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

export default MagneticElement;