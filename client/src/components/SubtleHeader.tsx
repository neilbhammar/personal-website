import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SubtleHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SubtleHeader: React.FC<SubtleHeaderProps> = ({ children, className = '' }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!headerRef.current) return;
    
    // Set initial opacity to 0
    gsap.set(headerRef.current, { opacity: 0, y: -10 });
    
    // Animate in with subtle fade
    gsap.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.2
    });
  }, []);
  
  // Handle scroll behavior - subtle transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      // Calculate opacity based on scroll position
      const scrollY = window.scrollY;
      const opacity = Math.max(0.65, 1 - (scrollY / 300));
      
      // Apply styles
      headerRef.current.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      
      // Add shadow as user scrolls
      if (scrollY > 50) {
        headerRef.current.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
      } else {
        headerRef.current.style.boxShadow = 'none';
      }
    };
    
    // Set initial styles
    if (headerRef.current) {
      headerRef.current.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      headerRef.current.style.transition = 'box-shadow 0.3s ease';
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      ref={headerRef}
      className={`w-full fixed top-0 left-0 z-50 py-4 px-6 ${className}`}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </div>
  );
};

export default SubtleHeader;