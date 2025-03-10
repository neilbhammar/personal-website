import React, { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [exhaustPuffs, setExhaustPuffs] = useState<{ id: number, x: number, y: number, opacity: number, size: number }[]>([]);
  const animationRef = useRef<number>(0);

  // 3D-like animation with depth and perspective
  const busAnimation = useSpring({
    transform: active 
      ? 'perspective(1000px) translateX(350px) translateY(0px) rotateY(-5deg)' 
      : 'perspective(1000px) translateX(-200px) translateY(20px) rotateY(15deg)',
    config: { 
      tension: 100,
      friction: 20,
      mass: 1.5
    },
    reset: true,
  });

  // Dynamic road movement animation
  const roadAnimation = useSpring({
    from: { backgroundPosition: '0px 0px' },
    to: { backgroundPosition: active ? '-1000px 0px' : '0px 0px' },
    config: { 
      duration: active ? 5000 : 0,
    },
    reset: true,
  });

  // Buildings parallax effect
  const buildingsAnimation = useSpring({
    from: { backgroundPosition: '0px 0px' },
    to: { backgroundPosition: active ? '-500px 0px' : '0px 0px' },
    config: { 
      duration: active ? 5000 : 0,
    },
    reset: true,
  });

  // Animate exhaust puffs
  useEffect(() => {
    if (!active) {
      setExhaustPuffs([]);
      return;
    }

    const createPuff = () => {
      const newPuff = {
        id: Date.now(),
        x: 20,
        y: 60,
        opacity: 0.8,
        size: Math.random() * 5 + 5
      };

      setExhaustPuffs(prev => [...prev, newPuff]);

      // Remove old puffs
      setTimeout(() => {
        setExhaustPuffs(prev => prev.filter(puff => puff.id !== newPuff.id));
      }, 2000);
    };

    const puffInterval = setInterval(createPuff, 300);

    return () => {
      clearInterval(puffInterval);
    };
  }, [active]);

  // Handle wheels and animations
  useEffect(() => {
    const updatePuffs = () => {
      setExhaustPuffs(prev => 
        prev.map(puff => ({
          ...puff,
          x: puff.x - 2,
          y: puff.y - 0.5,
          opacity: puff.opacity - 0.01,
          size: puff.size + 0.2
        }))
      );

      if (active) {
        animationRef.current = requestAnimationFrame(updatePuffs);
      }
    };

    if (active) {
      animationRef.current = requestAnimationFrame(updatePuffs);
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
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive]);

  return (
    <div className="bus-animation-container">
      {/* Sky background */}
      <animated.div className="sky" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '60%',
        background: 'linear-gradient(to bottom, #87CEEB, #C6E4F8)',
        zIndex: 1
      }} />

      {/* Buildings background with parallax */}
      <animated.div className="buildings" style={{
        ...buildingsAnimation,
        position: 'absolute',
        bottom: '40%',
        left: 0,
        width: '200%',
        height: '40%',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 200\'%3E%3Cpath d=\'M0,200 L0,120 L40,120 L40,80 L60,80 L60,100 L80,100 L80,60 L100,60 L100,130 L120,130 L120,100 L140,100 L140,140 L160,140 L160,90 L180,90 L180,120 L200,120 L200,70 L220,70 L220,100 L240,100 L240,150 L260,150 L260,100 L280,100 L280,120 L300,120 L300,80 L320,80 L320,140 L340,140 L340,110 L360,110 L360,130 L380,130 L380,90 L400,90 L400,110 L420,110 L420,140 L440,140 L440,100 L460,100 L460,120 L480,120 L480,80 L500,80 L500,140 L520,140 L520,110 L540,110 L540,130 L560,130 L560,90 L580,90 L580,110 L600,110 L600,140 L620,140 L620,100 L640,100 L640,120 L660,120 L660,80 L680,80 L680,140 L700,140 L700,110 L720,110 L720,130 L740,130 L740,90 L760,90 L760,110 L780,110 L780,140 L800,140 L800,100 L820,100 L820,120 L840,120 L840,80 L860,80 L860,140 L880,140 L880,110 L900,110 L900,130 L920,130 L920,90 L940,90 L940,110 L960,110 L960,140 L980,140 L980,100 L1000,100 L1000,200 Z\' fill=\'%23718096\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'contain',
        zIndex: 2
      }} />

      {/* Road with moving animation */}
      <animated.div className="road" style={{
        ...roadAnimation,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '200%',
        height: '40%',
        background: '#2D3748',
        zIndex: 3
      }}>
        {/* Road markings */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '5px',
          background: 'repeating-linear-gradient(to right, white 0px, white 50px, transparent 50px, transparent 100px)',
          zIndex: 4
        }} />
      </animated.div>

      {/* The modern, stylized bus */}
      <animated.div style={{
        ...busAnimation,
        position: 'absolute',
        bottom: '25%',
        left: 0,
        zIndex: 10
      }}>
        {/* Exhaust puffs */}
        {exhaustPuffs.map(puff => (
          <div 
            key={puff.id}
            style={{
              position: 'absolute',
              bottom: `${puff.y}px`,
              left: `${puff.x}px`,
              width: `${puff.size}px`,
              height: `${puff.size}px`,
              borderRadius: '50%',
              background: 'rgba(200, 200, 200, 0.6)',
              opacity: puff.opacity,
              zIndex: 7
            }}
          />
        ))}

        {/* School bus SVG - modern and stylish design */}
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Bus body - with modern styling and gradient */}
          <g className="bus-body">
            {/* Main chassis with rounded corners */}
            <path 
              d="M25,80 L25,40 C25,35 30,30 35,30 L145,30 C150,30 155,35 155,40 L155,80 L165,80 L180,65 L180,80 Z" 
              fill="url(#modernBusGradient)" 
              stroke="#F9A826" 
              strokeWidth="2"
            />

            {/* Bus roof with subtle curve */}
            <path 
              d="M35,30 C40,25 140,25 145,30" 
              fill="none" 
              stroke="#F9A826" 
              strokeWidth="2"
            />

            {/* Windows with modern gradient */}
            <path 
              d="M40,40 L40,60 L55,60 L55,40 Z" 
              fill="url(#windowGradient)"
            />
            <path 
              d="M65,40 L65,60 L80,60 L80,40 Z" 
              fill="url(#windowGradient)"
            />
            <path 
              d="M90,40 L90,60 L105,60 L105,40 Z" 
              fill="url(#windowGradient)"
            />
            <path 
              d="M115,40 L115,60 L130,60 L130,40 Z" 
              fill="url(#windowGradient)"
            />

            {/* Driver's window - larger */}
            <path 
              d="M140,40 L140,60 L155,60 L155,40 Z" 
              fill="url(#windowGradient)"
            />

            {/* Windshield with modern look */}
            <path 
              d="M155,60 L165,60 L175,50 L175,60 Z" 
              fill="url(#windowGradient)"
            />

            {/* Door */}
            <path 
              d="M30,50 L30,80 L45,80 L45,50 Z" 
              fill="#4A5568"
              stroke="#F9A826"
              strokeWidth="1"
            />

            {/* Stop sign (animated) */}
            <g className="stop-sign" style={{ 
              transform: active ? 'rotate(0deg)' : 'rotate(90deg)',
              transformOrigin: '25px 55px',
              transition: 'transform 0.5s ease'
            }}>
              <polygon 
                points="15,50 20,45 25,45 30,50 30,55 25,60 20,60 15,55" 
                fill="#E53E3E" 
                stroke="#fff" 
                strokeWidth="1"
              />
              <text x="22.5" y="55" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">STOP</text>
            </g>

            {/* Headlights with glow effect */}
            <circle 
              cx="175" 
              cy="70" 
              r="5" 
              fill="#F6E05E" 
              filter={active ? "url(#headlightGlow)" : ""}
            />

            {/* Wheels with modern hub caps */}
            <g className="wheel front-wheel">
              <circle cx="145" cy="90" r="10" fill="#1A202C" />
              <circle cx="145" cy="90" r="7" fill="#4A5568" />
              <circle cx="145" cy="90" r="3" fill="#A0AEC0" />
              <circle cx="145" cy="90" r="1" fill="#1A202C" />
            </g>

            <g className="wheel rear-wheel">
              <circle cx="45" cy="90" r="10" fill="#1A202C" />
              <circle cx="45" cy="90" r="7" fill="#4A5568" />
              <circle cx="45" cy="90" r="3" fill="#A0AEC0" />
              <circle cx="45" cy="90" r="1" fill="#1A202C" />
            </g>

            {/* Bumpers */}
            <rect x="25" y="80" width="155" height="5" rx="2" fill="#4A5568" />
            <rect x="175" y="80" width="5" height="5" rx="1" fill="#4A5568" />

            {/* School bus text */}
            <g transform="translate(85, 25)">
              <rect x="0" y="0" width="50" height="10" rx="5" fill="#1A202C" />
              <text x="25" y="7.5" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">SCHOOL BUS</text>
            </g>

            {/* Warning lights */}
            <circle cx="35" cy="30" r="3" fill={active ? "#F56565" : "#A0AEC0"} />
            <circle cx="145" cy="30" r="3" fill={active ? "#F56565" : "#A0AEC0"} />

            {/* License plate */}
            <rect x="155" y="70" width="15" height="8" rx="1" fill="#E2E8F0" />
            <text x="162.5" y="76" fontSize="5" fill="#2D3748" textAnchor="middle">SCH001</text>
          </g>

          {/* Gradients and filters */}
          <defs>
            <linearGradient id="modernBusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
            </linearGradient>

            <filter id="headlightGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </animated.div>
    </div>
  );
};

export default BusAnimation;