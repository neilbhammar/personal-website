
import React, { useEffect, useRef } from 'react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  growth: number;
  maxSize: number;
}

const CanvasAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 });
  const { features, isMobile } = useFeatureFlags();
  
  // Generate a vibrant color palette
  const colors = [
    '#FF3366', '#FF6633', '#FFCC33', '#33CC99', '#3399FF', 
    '#9966FF', '#FF99CC', '#99CCFF'
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (!features.enableAnimations || isMobile) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          color: getRandomColor(),
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          alpha: 0.7,
          growth: Math.random() * 0.1 - 0.05,
          maxSize: Math.random() * 10 + 5
        });
      }
    };
    
    const connectParticles = () => {
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x;
          const dy = particlesRef.current[a].y - particlesRef.current[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(150, 150, 150, ${0.15 - (distance / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        
        // Update size with growth
        p.size += p.growth;
        if (p.size <= 1 || p.size >= p.maxSize) {
          p.growth *= -1;
        }
        
        // Mouse interaction
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const force = mouseRef.current.radius / distance;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 0.3;
          const pushY = Math.sin(angle) * force * 0.3;
          
          p.x += pushX;
          p.y += pushY;
        }
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check with bounce
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX *= -1;
        }
        
        if (p.y < 0 || p.y > canvas.height) {
          p.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 100) + ')';
        ctx.fill();
      }
      
      connectParticles();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [features.enableAnimations, isMobile]);
  
  if (!features.enableAnimations || isMobile) return null;
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CanvasAnimation;
