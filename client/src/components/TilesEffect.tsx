import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface TilesEffectProps {
  text: string;
  isActive: boolean;
  onComplete?: () => void;
}

const TilesEffect: React.FC<TilesEffectProps> = ({ 
  text, 
  isActive,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create and animate the tiles
  useEffect(() => {
    // Skip if not active or already initialized
    if (!isActive || isInitialized) return;
    
    // Mark as initialized to prevent repeated animations
    setIsInitialized(true);
    
    // Create tiles for each character in text
    if (containerRef.current) {
      // Clear container
      containerRef.current.innerHTML = '';
      
      // Create the timeline
      const timeline = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        }
      });
      timelineRef.current = timeline;
      
      // Create tiles
      const tiles: HTMLDivElement[] = [];
      const chars = text.split('');
      
      chars.forEach((char, index) => {
        // Create tile element
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = char.toUpperCase();
        tile.style.position = 'absolute';
        tile.style.backgroundColor = '#f4d9b0';
        tile.style.color = '#000';
        tile.style.padding = '8px 12px';
        tile.style.margin = '4px';
        tile.style.borderRadius = '4px';
        tile.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        tile.style.fontFamily = 'monospace';
        tile.style.fontWeight = 'bold';
        tile.style.fontSize = '24px';
        tile.style.textAlign = 'center';
        tile.style.minWidth = '1.5em';
        tile.style.transform = 'translate(-50%, -50%)';
        tile.style.zIndex = '100';
        tile.style.userSelect = 'none';
        
        // Add to container
        containerRef.current?.appendChild(tile);
        tiles.push(tile);
      });
      
      // Store tiles for cleanup
      tilesRef.current = tiles;
      
      // Starting position above viewport
      tiles.forEach((tile, i) => {
        // Set random initial position above the screen
        gsap.set(tile, {
          x: 100 + (i * 50) + (Math.random() * 50),
          y: -100 - (Math.random() * 200),
          rotation: Math.random() * 360,
          opacity: 0
        });
      });
      
      // Animate tiles falling with simple animation instead of physics
      tiles.forEach((tile, i) => {
        // Calculate final positions
        const finalX = 100 + (i * 50) + (Math.random() * 100 - 50);
        const finalY = window.innerHeight * 0.7 + (Math.random() * 100);
        
        timeline.to(tile, {
          duration: 1.5,
          opacity: 1,
          x: finalX,
          y: finalY,
          rotation: -20 + (Math.random() * 40),
          delay: i * 0.1,
          ease: "bounce.out",
          onComplete: function() {
            // Add a small bounce effect when tile lands
            gsap.to(tile, {
              y: '-=20',
              rotation: Math.random() * 10 - 5,
              duration: 0.3,
              ease: 'power1.out',
              yoyo: true,
              repeat: 1
            });
          }
        }, 0);
      });
    }
    
    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isActive, text, isInitialized, onComplete]);

  // Clean up tiles when no longer active
  useEffect(() => {
    if (!isActive && isInitialized && tilesRef.current.length > 0) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setIsInitialized(false);
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        }
      });
      
      tilesRef.current.forEach((tile, i) => {
        timeline.to(tile, {
          y: '+=300',
          opacity: 0,
          duration: 0.5,
          rotation: Math.random() * 180 - 90,
          delay: i * 0.05,
          ease: 'power1.in'
        }, 0);
      });
    }
  }, [isActive, isInitialized]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ display: isActive ? 'block' : 'none' }}
    />
  );
};

export default TilesEffect;