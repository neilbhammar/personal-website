
import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>(0);
  
  // Bus movement animation with improved physics
  const busAnimation = useSpring({
    x: active ? 250 : -150,
    config: { 
      tension: 80,
      friction: 10,
      mass: 1.5
    },
    reset: true,
  });
  
  // Bus bounce animation with smoother motion
  const bounceAnimation = useSpring({
    y: active ? -2 : 0,
    config: { 
      tension: 200,
      friction: 12,
    },
    loop: active ? { reverse: true } : false,
  });

  // Exhaust puff animation
  const [exhaustPuffs, setExhaustPuffs] = useState<{ id: number, x: number, y: number, scale: number, opacity: number }[]>([]);
  const puffIdRef = useRef(0);

  // Create exhaust puffs
  useEffect(() => {
    let puffInterval: NodeJS.Timeout | null = null;
    
    if (active) {
      puffInterval = setInterval(() => {
        const newPuff = {
          id: puffIdRef.current++,
          x: 0,
          y: 0,
          scale: 1,
          opacity: 0.7
        };
        
        setExhaustPuffs(prev => [...prev, newPuff]);
        
        // Remove old puffs to prevent memory issues
        if (exhaustPuffs.length > 10) {
          setExhaustPuffs(prev => prev.slice(1));
        }
      }, 300);
    }
    
    return () => {
      if (puffInterval) clearInterval(puffInterval);
    };
  }, [active, exhaustPuffs.length]);

  // Animate exhaust puffs
  useEffect(() => {
    const animatePuffs = () => {
      if (active) {
        setExhaustPuffs(prev => 
          prev.map(puff => ({
            ...puff,
            x: puff.x - 5,
            y: puff.y - 2,
            scale: puff.scale + 0.05,
            opacity: puff.opacity - 0.03
          })).filter(puff => puff.opacity > 0)
        );
        animationRef.current = requestAnimationFrame(animatePuffs);
      }
    };
    
    if (active) {
      animationRef.current = requestAnimationFrame(animatePuffs);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [active, exhaustPuffs]);
  
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isActive) {
      setActive(true);
      
      // Reset animation after it completes
      timeoutRef.current = setTimeout(() => {
        setActive(false);
      }, 4000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive]);
  
  return (
    <div className="bus-animation-container" style={{ overflow: 'hidden', position: 'relative', width: '300px', height: '150px' }}>
      <animated.div 
        style={{ 
          transform: busAnimation.x.to(x => `translateX(${x}px)`).to(x => 
            bounceAnimation.y.to(y => `translate(${x}px, ${y}px)`)
          )
        }}
      >
        <svg width="250" height="150" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Road with perspective */}
          <rect x="-50" y="100" width="350" height="25" fill="url(#roadGradient)" />
          <line x1="-50" y1="105" x2="300" y2="105" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="15 10" />
          
          {/* Scenery elements */}
          {active && (
            <>
              {/* Buildings in background */}
              <rect x="30" y="55" width="20" height="45" fill="#6B7280" opacity="0.7" />
              <rect x="55" y="40" width="15" height="60" fill="#4B5563" opacity="0.6" />
              <rect x="75" y="50" width="25" height="50" fill="#6B7280" opacity="0.5" />
              <rect x="105" y="35" width="18" height="65" fill="#4B5563" opacity="0.4" />
              <rect x="128" y="45" width="22" height="55" fill="#6B7280" opacity="0.3" />
              <rect x="170" y="60" width="30" height="40" fill="#4B5563" opacity="0.2" />
              
              {/* Sun or moon */}
              <circle cx="200" cy="30" r="15" fill="url(#sunGradient)" />
              <circle cx="200" cy="30" r="20" fill="url(#sunGlowGradient)" />
            </>
          )}
          
          {/* Bus engine exhaust */}
          {active && exhaustPuffs.map(puff => (
            <g key={puff.id} transform={`translate(${30 + puff.x}, ${82 + puff.y}) scale(${puff.scale})`} opacity={puff.opacity}>
              <circle cx="0" cy="0" r="3" fill="#9CA3AF" />
            </g>
          ))}
          
          {/* Bus wheels with realistic design and suspension */}
          <g transform="translate(45, 100)">
            <circle cx="0" cy="0" r="12" fill="#1F2937" />
            <circle cx="0" cy="0" r="8" fill="#4B5563" />
            <circle cx="0" cy="0" r="3" fill="#1F2937" />
            <g className="bus-wheel" style={{ transformOrigin: 'center' }}>
              <line x1="0" y1="-8" x2="0" y2="-3" stroke="#1F2937" strokeWidth="2" />
              <line x1="0" y1="3" x2="0" y2="8" stroke="#1F2937" strokeWidth="2" />
              <line x1="-8" y1="0" x2="-3" y2="0" stroke="#1F2937" strokeWidth="2" />
              <line x1="3" y1="0" x2="8" y2="0" stroke="#1F2937" strokeWidth="2" />
              <line x1="-5.5" y1="-5.5" x2="-2.5" y2="-2.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="2.5" y1="2.5" x2="5.5" y2="5.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="-5.5" y1="5.5" x2="-2.5" y2="2.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="2.5" y1="-2.5" x2="5.5" y2="-5.5" stroke="#1F2937" strokeWidth="2" />
            </g>
            <animate attributeName="cy" values="0;-2;0;-1;0" dur="0.5s" repeatCount={active ? "indefinite" : "0"} />
          </g>
          
          <g transform="translate(115, 100)">
            <circle cx="0" cy="0" r="12" fill="#1F2937" />
            <circle cx="0" cy="0" r="8" fill="#4B5563" />
            <circle cx="0" cy="0" r="3" fill="#1F2937" />
            <g className="bus-wheel" style={{ transformOrigin: 'center' }}>
              <line x1="0" y1="-8" x2="0" y2="-3" stroke="#1F2937" strokeWidth="2" />
              <line x1="0" y1="3" x2="0" y2="8" stroke="#1F2937" strokeWidth="2" />
              <line x1="-8" y1="0" x2="-3" y2="0" stroke="#1F2937" strokeWidth="2" />
              <line x1="3" y1="0" x2="8" y2="0" stroke="#1F2937" strokeWidth="2" />
              <line x1="-5.5" y1="-5.5" x2="-2.5" y2="-2.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="2.5" y1="2.5" x2="5.5" y2="5.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="-5.5" y1="5.5" x2="-2.5" y2="2.5" stroke="#1F2937" strokeWidth="2" />
              <line x1="2.5" y1="-2.5" x2="5.5" y2="-5.5" stroke="#1F2937" strokeWidth="2" />
            </g>
            <animate attributeName="cy" values="0;-1;0;-2;0" dur="0.6s" repeatCount={active ? "indefinite" : "0"} />
          </g>
          
          {/* Gradients and effects */}
          <defs>
            <linearGradient id="busBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <linearGradient id="busTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            
            <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
            
            <linearGradient id="windshieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            
            <linearGradient id="headlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <linearGradient id="headlightBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
            </linearGradient>
            
            <linearGradient id="tailLightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <radialGradient id="sunGlowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
            </radialGradient>
            
            <filter id="busShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.3" />
            </filter>
            
            <filter id="headlightGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Bus main body with modern design */}
          <g filter="url(#busShadow)">
            {/* Main body */}
            <rect x="30" y="55" width="120" height="45" rx="6" fill="url(#busBodyGradient)" />
            
            {/* Front section */}
            <path d="M30 85 L20 85 L20 55 Q20 55 30 55 L30 85 Z" fill="url(#busTopGradient)" />
            
            {/* Top of bus */}
            <rect x="30" y="45" width="120" height="10" rx="3" fill="url(#busTopGradient)" />
            
            {/* Front windshield */}
            <path d="M30 55 L20 55 L20 70 L30 70 Z" fill="url(#windshieldGradient)" />
            
            {/* Rear section */}
            <rect x="150" y="55" width="15" height="45" rx="2" fill="url(#busTopGradient)" />
            
            {/* Windows with reflections */}
            <rect x="35" y="60" width="18" height="15" rx="2" fill="url(#windowGradient)" />
            <rect x="58" y="60" width="18" height="15" rx="2" fill="url(#windowGradient)" />
            <rect x="81" y="60" width="18" height="15" rx="2" fill="url(#windowGradient)" />
            <rect x="104" y="60" width="18" height="15" rx="2" fill="url(#windowGradient)" />
            <rect x="127" y="60" width="18" height="15" rx="2" fill="url(#windowGradient)" />
            
            {/* Door */}
            <rect x="75" y="80" width="15" height="20" rx="1" fill="#1F2937" />
            <rect x="76" y="81" width="13" height="18" rx="1" fill="url(#windowGradient)" />
            <line x1="82.5" y1="81" x2="82.5" y2="99" stroke="#4B5563" strokeWidth="1" />
            
            {/* Headlights with glow effect */}
            {active && (
              <>
                <rect x="15" y="75" width="30" height="10" fill="url(#headlightBeamGradient)" />
                <circle cx="22" cy="80" r="3" fill="url(#headlightGradient)" filter="url(#headlightGlow)" />
              </>
            )}
            <circle cx="22" cy="80" r="3" fill={active ? "url(#headlightGradient)" : "#D1D5DB"} />
            
            {/* Taillights */}
            <rect x="164" y="70" width="3" height="10" rx="1" fill={active ? "url(#tailLightGradient)" : "#6B7280"} />
            
            {/* Bus details */}
            <rect x="30" y="90" width="120" height="5" fill="#1F2937" />
            <rect x="20" y="90" width="10" height="5" fill="#1F2937" />
            <rect x="150" y="90" width="15" height="5" fill="#1F2937" />
            
            {/* 'SCHOOL BUS' text */}
            <text x="80" y="53" fontSize="6" fontWeight="bold" fill="#1F2937" textAnchor="middle">SCHOOL BUS</text>
            
            {/* Decorative stripes */}
            <rect x="30" y="78" width="120" height="2" fill="#FEF3C7" />
          </g>
          
          {/* Animated passengers */}
          {active && (
            <>
              <g className="passenger" transform="translate(43, 67)">
                <circle cx="0" cy="0" r="3" fill="#4B5563" />
                <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                <animate attributeName="transform" values="translate(43, 67);translate(43, 66);translate(43, 67)" dur="0.8s" repeatCount="indefinite" />
              </g>
              <g className="passenger" transform="translate(67, 67)">
                <circle cx="0" cy="0" r="3" fill="#4B5563" />
                <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                <animate attributeName="transform" values="translate(67, 67);translate(67, 65);translate(67, 67)" dur="1s" repeatCount="indefinite" />
              </g>
              <g className="passenger" transform="translate(90, 67)">
                <circle cx="0" cy="0" r="3" fill="#4B5563" />
                <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                <animate attributeName="transform" values="translate(90, 67);translate(90, 66);translate(90, 67)" dur="1.2s" repeatCount="indefinite" />
              </g>
              <g className="passenger" transform="translate(113, 67)">
                <circle cx="0" cy="0" r="3" fill="#4B5563" />
                <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                <animate attributeName="transform" values="translate(113, 67);translate(113, 65);translate(113, 67)" dur="0.9s" repeatCount="indefinite" />
              </g>
              <g className="passenger" transform="translate(136, 67)">
                <circle cx="0" cy="0" r="3" fill="#4B5563" />
                <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                <animate attributeName="transform" values="translate(136, 67);translate(136, 66);translate(136, 67)" dur="1.1s" repeatCount="indefinite" />
              </g>
            </>
          )}
        </svg>
      </animated.div>
    </div>
  );
};

export default BusAnimation;
