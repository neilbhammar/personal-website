
import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wheelRotation = useRef(0);
  const animationRef = useRef<number>(0);
  
  // Bus movement animation
  const busAnimation = useSpring({
    x: active ? 150 : -50,
    config: { 
      tension: 120,
      friction: 14,
    },
    reset: true,
  });
  
  // Bus bounce animation
  const bounceAnimation = useSpring({
    y: active ? -3 : 0,
    config: { 
      tension: 300,
      friction: 10,
    },
    loop: active ? { reverse: true } : false,
  });
  
  // Animate wheels
  useEffect(() => {
    const animateWheels = () => {
      if (active) {
        wheelRotation.current += 10;
        const wheels = document.querySelectorAll('.bus-wheel');
        wheels.forEach((wheel) => {
          (wheel as HTMLElement).style.transform = `rotate(${wheelRotation.current}deg)`;
        });
        animationRef.current = requestAnimationFrame(animateWheels);
      }
    };
    
    if (active) {
      animationRef.current = requestAnimationFrame(animateWheels);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [active]);
  
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
      }, 5000); // Longer animation time
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive]);
  
  return (
    <div className="bus-animation-container" style={{ overflow: 'hidden', position: 'relative', width: '250px', height: '120px' }}>
      <animated.div 
        style={{ 
          transform: busAnimation.x.to(x => `translateX(${x}px)`).to(x => 
            bounceAnimation.y.to(y => `translate(${x}px, ${y}px)`)
          )
        }}
      >
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Road */}
          <rect x="-50" y="85" width="300" height="15" fill="#555555" />
          <line x1="-50" y1="92" x2="250" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 10" />
          
          {/* Clouds */}
          {active && (
            <>
              <g className="cloud" style={{ transform: 'translate(150px, 15px)' }}>
                <circle cx="0" cy="0" r="10" fill="white" opacity="0.8" />
                <circle cx="-7" cy="0" r="7" fill="white" opacity="0.8" />
                <circle cx="7" cy="0" r="7" fill="white" opacity="0.8" />
                <circle cx="-5" cy="-5" r="7" fill="white" opacity="0.8" />
                <circle cx="5" cy="-5" r="7" fill="white" opacity="0.8" />
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
              </g>
              <g className="cloud" style={{ transform: 'translate(120px, 25px) scale(0.7)' }}>
                <circle cx="0" cy="0" r="10" fill="white" opacity="0.7" />
                <circle cx="-7" cy="0" r="7" fill="white" opacity="0.7" />
                <circle cx="7" cy="0" r="7" fill="white" opacity="0.7" />
                <circle cx="-5" cy="-5" r="7" fill="white" opacity="0.7" />
                <circle cx="5" cy="-5" r="7" fill="white" opacity="0.7" />
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" repeatCount="indefinite" />
              </g>
            </>
          )}

          {/* Bus body with gradients */}
          <defs>
            <linearGradient id="busGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFDD00" />
              <stop offset="100%" stopColor="#FFC107" />
            </linearGradient>
            <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B3E5FC" />
              <stop offset="100%" stopColor="#E0F7FA" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Bus main body */}
          <rect x="25" y="30" width="120" height="40" rx="6" fill="url(#busGradient)" filter="url(#shadow)" />
          <rect x="10" y="30" width="15" height="40" rx="3" fill="url(#busGradient)" filter="url(#shadow)" />
          <rect x="145" y="30" width="15" height="40" rx="3" fill="url(#busGradient)" filter="url(#shadow)" />
          
          {/* Windows with reflection effect */}
          <rect x="35" y="37" width="18" height="13" rx="2" fill="url(#windowGradient)" />
          <rect x="60" y="37" width="18" height="13" rx="2" fill="url(#windowGradient)" />
          <rect x="85" y="37" width="18" height="13" rx="2" fill="url(#windowGradient)" />
          <rect x="110" y="37" width="18" height="13" rx="2" fill="url(#windowGradient)" />
          
          {/* Window reflections */}
          {active && windows.map((window, i) => (
            <rect key={i} x={window.x} y={window.y} width="6" height="2" rx="1" fill="white" opacity="0.7">
              <animate 
                attributeName="x" 
                values={`${window.x};${window.x + 12}`} 
                dur="1.5s" 
                begin={i * 0.2}
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                values="0.7;0;0.7" 
                dur="1.5s" 
                begin={i * 0.2}
                repeatCount="indefinite" 
              />
            </rect>
          ))}
          
          {/* Door */}
          <rect x="135" y="40" width="10" height="20" rx="1" fill="#E65100" fillOpacity="0.3" />
          
          {/* Wheels with spokes */}
          <g transform="translate(45, 75)">
            <circle className="bus-wheel" cx="0" cy="0" r="10" fill="#333333" stroke="#555555" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#555555" />
            <line x1="-7" y1="0" x2="7" y2="0" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="5" y1="-5" x2="-5" y2="5" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
          </g>
          <g transform="translate(120, 75)">
            <circle className="bus-wheel" cx="0" cy="0" r="10" fill="#333333" stroke="#555555" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#555555" />
            <line x1="-7" y1="0" x2="7" y2="0" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
            <line x1="5" y1="-5" x2="-5" y2="5" stroke="#555555" strokeWidth="2" className="bus-wheel-spoke" />
          </g>
          
          {/* Bus roof details */}
          <rect x="25" y="25" width="120" height="5" rx="2" fill="#FFA000" />
          
          {/* Bumper */}
          <rect x="10" y="65" width="15" height="5" rx="1" fill="#E0E0E0" />
          <rect x="145" y="65" width="15" height="5" rx="1" fill="#E0E0E0" />
          
          {/* Front lights */}
          <circle cx="15" cy="45" r="4" fill="#FFFFFF" stroke="#DDDDDD" />
          {active && (
            <circle cx="15" cy="45" r="7" fill="#FFFFFF" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="7;9;7" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}
          
          {/* Back lights */}
          <rect x="155" y="40" width="4" height="7" rx="1" fill="#F44336" />
          {active && (
            <rect x="155" y="40" width="4" height="7" rx="1" fill="#F44336" opacity="0.5">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite" />
            </rect>
          )}
          
          {/* Exhaust smoke */}
          {active && (
            <>
              <circle cx="10" cy="65" r="3" fill="#888" opacity="0.7">
                <animate attributeName="cx" values="10;0;-10" dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values="65;62;59" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0.4;0" dur="1s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;3;4" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="10" cy="65" r="2" fill="#888" opacity="0.5">
                <animate attributeName="cx" values="10;-2;-14" dur="1.3s" repeatCount="indefinite" />
                <animate attributeName="cy" values="65;60;55" dur="1.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.3;0" dur="1.3s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.5;2.5;3.5" dur="1.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="10" cy="65" r="2.5" fill="#888" opacity="0.6">
                <animate attributeName="cx" values="10;-5;-20" dur="1.7s" repeatCount="indefinite" />
                <animate attributeName="cy" values="65;58;51" dur="1.7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur="1.7s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.8;3;4.2" dur="1.7s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          
          {/* School Bus Text */}
          <text x="70" y="57" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#333" textAnchor="middle">SCHOOL BUS</text>
          
          {/* STOP sign on the side */}
          <g transform="translate(140, 50) scale(0.3)">
            <polygon points="0,0 30,0 30,30 0,30" fill="#FF0000" />
            <text x="15" y="20" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">STOP</text>
          </g>
          
          {/* Children silhouettes in windows (when active) */}
          {active && (
            <>
              <g transform="translate(40, 43)">
                <circle cx="0" cy="0" r="2.5" fill="#333" />
                <rect x="-1.5" y="2.5" width="3" height="4" rx="1" fill="#333" />
                <animate attributeName="transform" values="translate(40, 43);translate(40, 42);translate(40, 43)" dur="0.6s" repeatCount="indefinite" />
              </g>
              <g transform="translate(90, 43)">
                <circle cx="0" cy="0" r="2.5" fill="#333" />
                <rect x="-1.5" y="2.5" width="3" height="4" rx="1" fill="#333" />
                <animate attributeName="transform" values="translate(90, 43);translate(90, 41);translate(90, 43)" dur="0.7s" repeatCount="indefinite" />
              </g>
              <g transform="translate(115, 43)">
                <circle cx="0" cy="0" r="2.5" fill="#333" />
                <rect x="-1.5" y="2.5" width="3" height="4" rx="1" fill="#333" />
                <animate attributeName="transform" values="translate(115, 43);translate(115, 42);translate(115, 43)" dur="0.8s" repeatCount="indefinite" />
              </g>
            </>
          )}
        </svg>
      </animated.div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .bus-wheel {
            transform-origin: center;
            transition: transform 0.1s linear;
          }
          
          .bus-animation-container {
            perspective: 800px;
          }
        `
      }} />
    </div>
  );
};

// Window reflection positions
const windows = [
  { x: 36, y: 40 },
  { x: 61, y: 40 },
  { x: 86, y: 40 },
  { x: 111, y: 40 },
];

export default BusAnimation;
