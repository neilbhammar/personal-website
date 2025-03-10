import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface WordInteractionProps {
  word: string;
  interactionType: 'flashlight' | 'tiles' | 'highlight' | 'zoom' | 'scramble';
  children: React.ReactNode;
  className?: string;
}

/**
 * Component that creates subtle interactive effects on specific words
 */
const WordInteraction: React.FC<WordInteractionProps> = ({
  word,
  interactionType,
  children,
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Flashlight effect state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Tiles effect state
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLSpanElement[]>([]);
  
  // Handle mouse position for flashlight
  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current || !isActive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle hover interactions
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Set a timeout to activate the effect only if user hovers for a while
    timeoutRef.current = setTimeout(() => {
      setIsActive(true);
      
      // Run effect based on type
      if (interactionType === 'flashlight') {
        document.documentElement.style.cursor = 'none';
      } else if (interactionType === 'tiles') {
        createTilesEffect();
      } else if (interactionType === 'scramble') {
        scrambleText();
      } else if (interactionType === 'zoom') {
        zoomEffect();
      }
    }, 600); // Wait 600ms before activating
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Clear the timeout if user leaves before activation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset effects
    if (isActive) {
      setIsActive(false);
      document.documentElement.style.cursor = '';
      
      // Clean up specific effects
      if (interactionType === 'tiles') {
        cleanupTilesEffect();
      }
    }
  };

  // Scramble effect implementation
  const scrambleText = () => {
    if (!containerRef.current) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const element = containerRef.current;
    const originalText = word;
    let iterations = 0;
    
    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
      }
      
      iterations += 1/3;
    }, 50);
  };

  // Zoom effect implementation
  const zoomEffect = () => {
    if (!containerRef.current) return;
    
    gsap.to(containerRef.current, {
      scale: 1.8,
      color: "#30b4bc", 
      fontWeight: "bold",
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        if (!isHovering) {
          gsap.to(containerRef.current, {
            scale: 1,
            color: "inherit",
            fontWeight: "normal",
            duration: 0.3,
            ease: "power2.in"
          });
        }
      }
    });
  };

  // Tiles effect implementation
  const createTilesEffect = () => {
    if (!containerRef.current || !tilesContainerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    tilesContainerRef.current.style.display = 'block';
    
    // Create tiles for each letter
    const letters = word.split('');
    tilesRef.current = [];
    
    // Clean previous tiles
    tilesContainerRef.current.innerHTML = '';
    
    // Create new tiles
    letters.forEach((letter, index) => {
      const tile = document.createElement('span');
      tile.className = 'tile';
      tile.textContent = letter.toUpperCase();
      tile.style.position = 'absolute';
      tile.style.backgroundColor = '#f4d9b0';
      tile.style.color = '#000';
      tile.style.padding = '0.1rem 0.3rem';
      tile.style.margin = '0.1rem';
      tile.style.borderRadius = '0.2rem';
      tile.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      tile.style.display = 'inline-block';
      tile.style.zIndex = '100';
      tile.style.fontFamily = 'monospace';
      tile.style.fontWeight = 'bold';
      tile.style.transform = 'translate(-50%, -100%)';
      
      tilesContainerRef.current?.appendChild(tile);
      tilesRef.current.push(tile);
      
      // Initial position above the word
      gsap.set(tile, { 
        x: rect.left + (index * (rect.width / letters.length)) + (rect.width / letters.length / 2), 
        y: rect.top - 20,
        opacity: 0,
        rotate: -5 + Math.random() * 10
      });
      
      // Animate falling
      gsap.to(tile, {
        x: `+=${-20 + Math.random() * 40}`,
        y: `+=${80 + Math.random() * 60}`,
        opacity: 1,
        duration: 0.6 + Math.random() * 0.8,
        delay: index * 0.08,
        ease: "bounce.out",
        rotation: -15 + Math.random() * 30
      });
    });
  };

  // Clean up tiles effect
  const cleanupTilesEffect = () => {
    if (!tilesRef.current.length || !tilesContainerRef.current) return;
    
    tilesRef.current.forEach((tile, index) => {
      gsap.to(tile, {
        y: '+=100',
        opacity: 0,
        duration: 0.4,
        delay: index * 0.03,
        onComplete: () => {
          if (index === tilesRef.current.length - 1 && tilesContainerRef.current) {
            tilesContainerRef.current.style.display = 'none';
          }
        }
      });
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Special interactive styles
  const interactiveStyle = isHovering 
    ? { textDecoration: isActive ? 'none' : 'underline', cursor: 'pointer', color: isActive ? 'inherit' : '#30b4bc' }
    : { cursor: 'pointer' };

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        ref={containerRef}
        className={`interactive-word ${isActive ? 'active' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={interactiveStyle}
      >
        {word}
      </span>
      
      {/* Flashlight effect */}
      {interactionType === 'flashlight' && isActive && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 pointer-events-none"
          style={{
            maskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`
          }}
        />
      )}
      
      {/* Container for tiles effect */}
      <div 
        ref={tilesContainerRef} 
        className="tiles-container fixed inset-0 z-50 pointer-events-none" 
        style={{ display: 'none' }}
      />
      
      {children}
    </span>
  );
};

export default WordInteraction;