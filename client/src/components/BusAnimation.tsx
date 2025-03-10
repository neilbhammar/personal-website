
import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>(0);
  const cityRef = useRef<SVGSVGElement>(null);
  const busRef = useRef<SVGGElement>(null);
  
  // Advanced bus movement animation with better physics
  const busAnimation = useSpring({
    x: active ? 350 : -200,
    config: { 
      tension: 120,
      friction: 14,
      mass: 2
    },
    reset: true,
  });
  
  // Bouncing suspension effect
  const bounceAnimation = useSpring({
    y: active ? -3 : 0,
    config: { 
      tension: 300,
      friction: 10,
    },
    loop: active ? { reverse: true } : false,
  });

  // Wheel rotation animation
  const [wheelRotation, setWheelRotation] = useState(0);
  
  // Cloud movement animation
  const [clouds, setClouds] = useState<{ id: number, x: number, y: number, size: number }[]>([
    { id: 1, x: 50, y: 20, size: 30 },
    { id: 2, x: 150, y: 30, size: 40 },
    { id: 3, x: 250, y: 15, size: 25 },
  ]);

  // Star twinkle animation for night mode
  const [stars, setStars] = useState<{ id: number, x: number, y: number, opacity: number, size: number }[]>([]);
  
  // Generate stars
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 20; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 60,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 1.5 + 0.5
      });
    }
    setStars(newStars);
  }, []);

  // Exhaust animation
  const [exhaustPuffs, setExhaustPuffs] = useState<{ id: number, x: number, y: number, scale: number, opacity: number }[]>([]);
  const puffIdRef = useRef(0);

  // Animate exhaust puffs
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
      }, 200);
    }
    
    return () => {
      if (puffInterval) clearInterval(puffInterval);
    };
  }, [active, exhaustPuffs.length]);

  // City parallax effect
  useEffect(() => {
    const moveClouds = () => {
      if (active) {
        setClouds(prev => 
          prev.map(cloud => ({
            ...cloud,
            x: cloud.x - (0.5 * cloud.size / 20),
            // Wrap around when cloud goes off screen
            ...(cloud.x < -50 ? { x: 350 } : {})
          }))
        );
      }
    };

    // Animate wheel rotation
    const animateWheels = () => {
      if (active) {
        setWheelRotation(prev => (prev + 10) % 360);
      }
    };

    // Twinkle stars
    const animateStars = () => {
      if (active) {
        setStars(prev => 
          prev.map(star => ({
            ...star,
            opacity: star.opacity + (Math.random() * 0.1 - 0.05),
            ...(star.opacity > 0.9 ? { opacity: 0.3 } : {}),
            ...(star.opacity < 0.2 ? { opacity: 0.6 } : {})
          }))
        );
      }
    };

    // Update exhaust puffs
    const animatePuffs = () => {
      if (active) {
        setExhaustPuffs(prev => 
          prev.map(puff => ({
            ...puff,
            x: puff.x - 8,
            y: puff.y - 3,
            scale: puff.scale + 0.08,
            opacity: puff.opacity - 0.04
          })).filter(puff => puff.opacity > 0)
        );
      }
    };

    const animate = () => {
      moveClouds();
      animateWheels();
      animateStars();
      animatePuffs();
      
      if (active) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (active) {
      animationRef.current = requestAnimationFrame(animate);
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
  
  // Day/night cycle
  const isNightMode = active;
  
  return (
    <div className="bus-animation-container" style={{ overflow: 'hidden', position: 'relative', width: '300px', height: '150px' }}>
      <animated.div 
        style={{ 
          transform: busAnimation.x.to(x => `translateX(${x}px)`).to(x => 
            bounceAnimation.y.to(y => `translate(${x}px, ${y}px)`)
          ),
          position: 'relative',
          zIndex: 10
        }}
        className="bus-wrapper"
      >
        <svg width="200" height="150" viewBox="0 0 200 150" ref={cityRef}>
          {/* Background with day/night transition */}
          <rect 
            x="0" 
            y="0" 
            width="300" 
            height="150" 
            fill={isNightMode ? '#0F172A' : '#87CEEB'}
            className="sky-background"
            style={{ transition: 'fill 1s ease' }}
          />
          
          {/* Stars (only visible at night) */}
          {isNightMode && stars.map(star => (
            <circle 
              key={star.id}
              cx={star.x} 
              cy={star.y} 
              r={star.size}
              fill="#FFFFFF"
              opacity={star.opacity}
              className="twinkling-star"
            />
          ))}
          
          {/* Sun/Moon */}
          <circle 
            cx="250" 
            cy="30" 
            r="15" 
            fill={isNightMode ? '#F9FAFB' : '#FBBF24'}
            filter={isNightMode ? 'url(#moonGlow)' : 'url(#sunGlow)'}
            className="celestial-body"
            style={{ transition: 'fill 1s ease' }}
          />
          
          {/* Moon details (craters) */}
          {isNightMode && (
            <>
              <circle cx="245" cy="25" r="3" fill="#E5E7EB" opacity="0.6" />
              <circle cx="255" cy="35" r="4" fill="#E5E7EB" opacity="0.5" />
              <circle cx="240" cy="33" r="2" fill="#E5E7EB" opacity="0.7" />
            </>
          )}
          
          {/* Clouds */}
          {clouds.map(cloud => (
            <g key={cloud.id} transform={`translate(${cloud.x}, ${cloud.y})`} className="cloud">
              <path 
                d={`M0,0 
                  a${cloud.size/3},${cloud.size/3} 0 1,1 ${cloud.size/2},0 
                  a${cloud.size/4},${cloud.size/4} 0 1,1 ${cloud.size/2},0 
                  a${cloud.size/3},${cloud.size/3} 0 1,1 ${cloud.size/2},0 
                  a${cloud.size/4},${cloud.size/4} 0 1,1 ${cloud.size/-2},0 
                  a${cloud.size/3},${cloud.size/3} 0 1,1 ${cloud.size/-2},0 
                  z`} 
                fill={isNightMode ? "#475569" : "#FFFFFF"} 
                opacity={isNightMode ? "0.7" : "0.9"}
                style={{ transition: 'fill 1s ease, opacity 1s ease' }}
              />
            </g>
          ))}
          
          {/* City skyline silhouette */}
          <path 
            d="M0,120 L10,120 L10,100 L20,100 L20,110 L30,110 L30,85 L35,85 L35,95 L45,95 L45,80 
               L50,80 L50,70 L55,70 L55,80 L65,80 L65,95 L75,95 L75,85 L85,85 L85,100 L95,100 
               L95,75 L100,75 L100,65 L105,65 L105,75 L110,75 L110,90 L120,90 L120,100 L130,100 
               L130,80 L140,80 L140,110 L150,110 L150,95 L155,95 L155,105 L165,105 L165,90 
               L175,90 L175,100 L185,100 L185,110 L195,110 L195,95 L200,95 L200,120 L300,120 L300,150 L0,150 Z" 
            fill={isNightMode ? "#1E293B" : "#334155"}
            style={{ transition: 'fill 1s ease' }}
          />
          
          {/* Building windows (lit up at night) */}
          {isNightMode && (
            <>
              <rect x="15" y="105" width="3" height="3" fill="#FBBF24" opacity="0.8" />
              <rect x="32" y="90" width="2" height="3" fill="#FBBF24" opacity="0.7" />
              <rect x="48" y="85" width="3" height="3" fill="#FBBF24" opacity="0.8" />
              <rect x="70" y="90" width="2" height="3" fill="#FBBF24" opacity="0.9" />
              <rect x="98" y="80" width="3" height="3" fill="#FBBF24" opacity="0.7" />
              <rect x="116" y="95" width="2" height="3" fill="#FBBF24" opacity="0.8" />
              <rect x="135" y="85" width="3" height="3" fill="#FBBF24" opacity="0.9" />
              <rect x="152" y="100" width="2" height="3" fill="#FBBF24" opacity="0.7" />
              <rect x="169" y="95" width="3" height="3" fill="#FBBF24" opacity="0.8" />
              <rect x="190" y="105" width="2" height="3" fill="#FBBF24" opacity="0.9" />
            </>
          )}
          
          {/* Road */}
          <rect x="0" y="120" width="300" height="30" fill="#1F2937" />
          <rect x="0" y="134" width="300" height="2" fill="#FFFFFF" strokeDasharray="10 10" />
          
          {/* Streetlights */}
          <g className="streetlight" transform="translate(40, 120)">
            <rect x="0" y="0" width="2" height="12" fill="#64748B" />
            <circle cx="1" cy="0" r="3" fill={isNightMode ? "#FBBF24" : "#94A3B8"} opacity={isNightMode ? "0.9" : "0.5"} />
          </g>
          <g className="streetlight" transform="translate(120, 120)">
            <rect x="0" y="0" width="2" height="12" fill="#64748B" />
            <circle cx="1" cy="0" r="3" fill={isNightMode ? "#FBBF24" : "#94A3B8"} opacity={isNightMode ? "0.9" : "0.5"} />
          </g>
          <g className="streetlight" transform="translate(200, 120)">
            <rect x="0" y="0" width="2" height="12" fill="#64748B" />
            <circle cx="1" cy="0" r="3" fill={isNightMode ? "#FBBF24" : "#94A3B8"} opacity={isNightMode ? "0.9" : "0.5"} />
          </g>
          
          <defs>
            <linearGradient id="busBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            
            <linearGradient id="busTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
            </linearGradient>
            
            <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#1F2937" />
            </radialGradient>
            
            <linearGradient id="headlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            
            <linearGradient id="tailLightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            
            <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="headlightBeam" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="busShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.4" />
            </filter>
          </defs>
          
          {/* The bus */}
          <g 
            ref={busRef} 
            filter="url(#busShadow)" 
            className="school-bus" 
            transform="translate(-180, 100) scale(0.9)"
          >
            {/* Bus chassis */}
            <rect x="20" y="15" width="160" height="50" rx="6" fill="url(#busBodyGradient)" />
            <rect x="20" y="5" width="120" height="10" rx="3" fill="url(#busTopGradient)" />
            <path d="M20 15 L20 5 Q20 5 30 5 L30 15 Z" fill="url(#busTopGradient)" />
            <path d="M140 15 L140 5 Q140 5 150 5 L150 15 Z" fill="url(#busTopGradient)" />
            
            {/* Hood section */}
            <rect x="180" y="35" width="15" height="30" rx="3" fill="url(#busBodyGradient)" />
            <path d="M160 35 L180 35 L180 65 L160 65 Z" fill="url(#busBodyGradient)" />
            
            {/* Front windshield */}
            <path d="M150 15 L150 5 L160 15 Z" fill="url(#windowGradient)" />
            <path d="M150 15 L150 50 L160 65 L160 35 L157 15 Z" fill="url(#windowGradient)" opacity="0.9" />
            
            {/* Windows */}
            <rect x="35" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            <rect x="55" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            <rect x="75" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            <rect x="95" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            <rect x="115" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            <rect x="135" y="15" width="10" height="20" rx="2" fill="url(#windowGradient)" opacity="0.9" />
            
            {/* Headlights */}
            <circle cx="190" cy="45" r="5" fill="#FFFFFF" />
            <circle cx="190" cy="55" r="5" fill="#FFFFFF" />
            
            {/* Headlight beams (only visible at night) */}
            {isNightMode && (
              <>
                <path 
                  d="M191,44 L240,30 L240,55 L191,49 Z" 
                  fill="url(#headlightGradient)" 
                  opacity="0.4" 
                  filter="url(#headlightBeam)"
                />
                <path 
                  d="M191,56 L240,60 L240,85 L191,61 Z" 
                  fill="url(#headlightGradient)" 
                  opacity="0.4" 
                  filter="url(#headlightBeam)"
                />
              </>
            )}
            
            {/* Door */}
            <rect x="45" y="35" width="15" height="30" rx="2" fill="#1F2937" />
            <rect x="55" y="45" width="2" height="10" rx="1" fill="#F59E0B" />
            
            {/* Taillights */}
            <rect x="20" y="45" width="5" height="10" rx="1" fill={active ? "url(#tailLightGradient)" : "#6B7280"} />
            
            {/* Undercarriage */}
            <rect x="20" y="65" width="175" height="8" rx="2" fill="#1F2937" />
            
            {/* "SCHOOL BUS" text */}
            <g transform="translate(70, 2)">
              <rect x="0" y="0" width="60" height="15" rx="3" fill="#1E293B" />
              <text x="30" y="10" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">SCHOOL BUS</text>
            </g>
            
            {/* Bus stop sign (folds out when the bus stops) */}
            <g 
              className="stop-sign" 
              style={{ 
                transformOrigin: '20px 30px',
                transform: active ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.5s ease'
              }}
            >
              <rect x="10" y="25" width="10" height="10" fill="#DC2626" />
              <text x="15" y="33" fontSize="6" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">STOP</text>
            </g>
            
            {/* Front bumper */}
            <rect x="180" y="65" width="15" height="5" rx="2" fill="#64748B" />
            
            {/* Warning lights on top */}
            <circle cx="30" cy="5" r="3" fill={active ? "#F87171" : "#6B7280"} />
            <circle cx="140" cy="5" r="3" fill={active ? "#F87171" : "#6B7280"} />
            
            {/* Wheels */}
            <g className="front-wheel" transform="translate(40, 75)">
              <circle cx="0" cy="0" r="12" fill="#1F2937" />
              <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
              <circle cx="0" cy="0" r="3" fill="#1F2937" />
              <g 
                className="wheel-spokes" 
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <line x1="0" y1="-8" x2="0" y2="-3" stroke="#1F2937" strokeWidth="2" />
                <line x1="0" y1="3" x2="0" y2="8" stroke="#1F2937" strokeWidth="2" />
                <line x1="-8" y1="0" x2="-3" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="3" y1="0" x2="8" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="-5.5" x2="-2.5" y2="-2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="2.5" x2="5.5" y2="5.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="5.5" x2="-2.5" y2="2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="-2.5" x2="5.5" y2="-5.5" stroke="#1F2937" strokeWidth="2" />
              </g>
            </g>
            
            <g className="rear-wheel" transform="translate(120, 75)">
              <circle cx="0" cy="0" r="12" fill="#1F2937" />
              <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
              <circle cx="0" cy="0" r="3" fill="#1F2937" />
              <g 
                className="wheel-spokes" 
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <line x1="0" y1="-8" x2="0" y2="-3" stroke="#1F2937" strokeWidth="2" />
                <line x1="0" y1="3" x2="0" y2="8" stroke="#1F2937" strokeWidth="2" />
                <line x1="-8" y1="0" x2="-3" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="3" y1="0" x2="8" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="-5.5" x2="-2.5" y2="-2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="2.5" x2="5.5" y2="5.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="5.5" x2="-2.5" y2="2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="-2.5" x2="5.5" y2="-5.5" stroke="#1F2937" strokeWidth="2" />
              </g>
            </g>
            
            <g className="back-wheel" transform="translate(170, 75)">
              <circle cx="0" cy="0" r="12" fill="#1F2937" />
              <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
              <circle cx="0" cy="0" r="3" fill="#1F2937" />
              <g 
                className="wheel-spokes" 
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <line x1="0" y1="-8" x2="0" y2="-3" stroke="#1F2937" strokeWidth="2" />
                <line x1="0" y1="3" x2="0" y2="8" stroke="#1F2937" strokeWidth="2" />
                <line x1="-8" y1="0" x2="-3" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="3" y1="0" x2="8" y2="0" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="-5.5" x2="-2.5" y2="-2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="2.5" x2="5.5" y2="5.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="-5.5" y1="5.5" x2="-2.5" y2="2.5" stroke="#1F2937" strokeWidth="2" />
                <line x1="2.5" y1="-2.5" x2="5.5" y2="-5.5" stroke="#1F2937" strokeWidth="2" />
              </g>
            </g>
            
            {/* Animated passengers */}
            {active && (
              <>
                <g className="passenger" transform="translate(40, 25)">
                  <circle cx="0" cy="0" r="3" fill="#4B5563" />
                  <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                  <circle cx="-1" cy="0" r="0.8" fill="#F9FAFB" />
                  <circle cx="1" cy="0" r="0.8" fill="#F9FAFB" />
                </g>
                <g className="passenger" transform="translate(60, 25)">
                  <circle cx="0" cy="0" r="3" fill="#4B5563" />
                  <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                  <circle cx="-1" cy="0" r="0.8" fill="#F9FAFB" />
                  <circle cx="1" cy="0" r="0.8" fill="#F9FAFB" />
                </g>
                <g className="passenger" transform="translate(80, 25)">
                  <circle cx="0" cy="0" r="3" fill="#4B5563" />
                  <rect x="-2" y="3" width="4" height="3" rx="1" fill="#4B5563" />
                  <circle cx="-1" cy="0" r="0.8" fill="#F9FAFB" />
                  <circle cx="1" cy="0" r="0.8" fill="#F9FAFB" />
                </g>
                <g className="passenger driver" transform="translate(140, 25)">
                  <circle cx="0" cy="0" r="4" fill="#1F2937" />
                  <rect x="-2.5" y="4" width="5" height="4" rx="1" fill="#1F2937" />
                  <circle cx="-1.5" cy="-0.5" r="1" fill="#F9FAFB" />
                  <circle cx="1.5" cy="-0.5" r="1" fill="#F9FAFB" />
                </g>
              </>
            )}
          </g>
          
          {/* Exhaust puffs */}
          {exhaustPuffs.map(puff => (
            <g key={puff.id} transform={`translate(${20 + puff.x}, ${90 + puff.y})`}>
              <circle 
                cx="0" 
                cy="0" 
                r={5 * puff.scale} 
                fill="#94A3B8" 
                opacity={puff.opacity} 
              />
            </g>
          ))}
        </svg>
      </animated.div>
    </div>
  );
};

export default BusAnimation;
