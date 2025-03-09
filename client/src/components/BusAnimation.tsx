import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation for bus bouncing
  const bounceAnimation = useSpring({
    y: active ? -5 : 0,
    config: { 
      tension: 300,
      friction: 10,
    },
    loop: active ? { reverse: true } : false,
  });
  
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
      }, 3000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive]);
  
  return (
    <div className={`bus-animation-container ${active ? 'active' : ''}`}>
      <animated.div style={{ transform: bounceAnimation.y.to(y => `translateY(${y}px)`) }}>
        <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bus body */}
          <rect x="15" y="20" width="120" height="40" rx="6" fill="#FFC107" />
          <rect x="5" y="20" width="10" height="40" fill="#FFC107" />
          <rect x="135" y="20" width="10" height="40" rx="3" fill="#FFC107" />
          
          {/* Windows */}
          <rect x="25" y="27" width="15" height="13" rx="2" fill="#E0F7FA" />
          <rect x="50" y="27" width="15" height="13" rx="2" fill="#E0F7FA" />
          <rect x="75" y="27" width="15" height="13" rx="2" fill="#E0F7FA" />
          <rect x="100" y="27" width="15" height="13" rx="2" fill="#E0F7FA" />
          <rect x="122" y="27" width="13" height="20" rx="2" fill="#E0F7FA" />
          
          {/* Windshield */}
          <path d="M5 20H18V50C18 54 14 60 10 60C6 60 5 54 5 50V20Z" fill="#E0F7FA" />
          
          {/* Wheels - with rotation animation */}
          <g className="wheel" style={{ transformOrigin: '40px 60px', animation: active ? 'spin 0.5s linear infinite' : 'none' }}>
            <circle cx="40" cy="60" r="10" fill="#333333" />
            <circle cx="40" cy="60" r="5" fill="#666666" />
            <line x1="40" y1="55" x2="40" y2="65" stroke="#444" strokeWidth="1.5" />
            <line x1="35" y1="60" x2="45" y2="60" stroke="#444" strokeWidth="1.5" />
          </g>
          
          <g className="wheel" style={{ transformOrigin: '110px 60px', animation: active ? 'spin 0.5s linear infinite' : 'none' }}>
            <circle cx="110" cy="60" r="10" fill="#333333" />
            <circle cx="110" cy="60" r="5" fill="#666666" />
            <line x1="110" y1="55" x2="110" y2="65" stroke="#444" strokeWidth="1.5" />
            <line x1="105" y1="60" x2="115" y2="60" stroke="#444" strokeWidth="1.5" />
          </g>
          
          {/* Details */}
          <rect x="15" y="13" width="120" height="7" rx="3" fill="#E65100" />
          <rect x="50" y="47" width="50" height="7" rx="2" fill="#333333" />
          
          {/* Lights */}
          <rect x="139" y="25" width="6" height="6" rx="1" fill="#FFEB3B" />
          <rect x="139" y="38" width="6" height="6" rx="1" fill="#F44336" />
          <rect x="5" y="25" width="6" height="6" rx="1" fill="#FFFFFF" />
          
          {/* Exhaust */}
          {active && (
            <>
              <circle cx="8" cy="48" r="3" fill="#888" opacity="0.7">
                <animate attributeName="cx" values="8;0" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="0.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="12" cy="48" r="2" fill="#888" opacity="0.5">
                <animate attributeName="cx" values="12;2" dur="0.7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0" dur="0.7s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          
          {/* School Bus Text */}
          <text x="50" y="40" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#333">SCHOOL BUS</text>
        </svg>
      </animated.div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BusAnimation;