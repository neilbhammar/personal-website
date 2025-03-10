import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const UltraMinimal = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [tilesActive, setTilesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lostHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update mouse position for flashlight effect
  useEffect(() => {
    if (!flashlightActive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY + window.scrollY
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [flashlightActive]);

  // Auto-disable effects after 10 seconds
  useEffect(() => {
    if (flashlightActive || tilesActive) {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      
      effectTimeoutRef.current = setTimeout(() => {
        setFlashlightActive(false);
        setTilesActive(false);
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, [flashlightActive, tilesActive]);
  
  // Handle hover on bananagrams
  const handleBananagramsHoverStart = () => {
    if (bananagramsHoverTimerRef.current) return;
    
    bananagramsHoverTimerRef.current = setTimeout(() => {
      setTilesActive(true);
      bananagramsHoverTimerRef.current = null;
    }, 5000); // 5 second delay
  };
  
  const handleBananagramsHoverEnd = () => {
    if (bananagramsHoverTimerRef.current) {
      clearTimeout(bananagramsHoverTimerRef.current);
      bananagramsHoverTimerRef.current = null;
    }
  };
  
  // Handle hover on lost
  const handleLostHoverStart = () => {
    if (lostHoverTimerRef.current) return;
    
    lostHoverTimerRef.current = setTimeout(() => {
      setFlashlightActive(true);
      lostHoverTimerRef.current = null;
    }, 5000); // 5 second delay
  };
  
  const handleLostHoverEnd = () => {
    if (lostHoverTimerRef.current) {
      clearTimeout(lostHoverTimerRef.current);
      lostHoverTimerRef.current = null;
    }
  };
  
  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (bananagramsHoverTimerRef.current) {
        clearTimeout(bananagramsHoverTimerRef.current);
      }
      if (lostHoverTimerRef.current) {
        clearTimeout(lostHoverTimerRef.current);
      }
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, []);
  
  // Create tiles animation with ALL letters on page
  const createTilesEffect = () => {
    if (!tilesContainerRef.current || !contentRef.current) return;
    
    // Clear previous tiles
    tilesContainerRef.current.innerHTML = '';
    
    // Get all text from the page
    const textContent = contentRef.current.innerText;
    // Filter out spaces and special characters
    const chars = textContent.split('').filter(char => /[a-zA-Z0-9]/.test(char));
    
    // Calculate viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    chars.forEach((char, index) => {
      // Create tile element
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = char;
      tile.style.position = 'fixed';
      tile.style.fontFamily = 'monospace';
      tile.style.fontSize = '14px';
      tile.style.opacity = '0';
      tile.style.pointerEvents = 'none';
      
      // Add to container
      tilesContainerRef.current?.appendChild(tile);
      
      // Random initial position across the viewport
      const startX = Math.random() * viewportWidth;
      const startY = Math.random() * (viewportHeight * 0.5);
      
      // Set initial position
      gsap.set(tile, {
        x: startX,
        y: startY,
        opacity: 0
      });
      
      // Animate each letter falling
      gsap.to(tile, {
        duration: 1.5 + (Math.random() * 1),
        x: startX + (-50 + Math.random() * 100),
        y: viewportHeight + 50,
        rotation: -20 + Math.random() * 40,
        opacity: 1,
        delay: Math.random() * 0.5, // Randomize start time
        ease: 'power1.in'
      });
    });
    
    // Set timer to clean up after animation completes
    setTimeout(() => {
      if (tilesContainerRef.current) {
        tilesContainerRef.current.innerHTML = '';
      }
    }, 5000);
  };
  
  // Trigger the tiles effect when activated
  useEffect(() => {
    if (tilesActive) {
      createTilesEffect();
    }
  }, [tilesActive]);
  
  return (
    <main className="py-10 px-8 md:py-16 md:px-16 relative">
      <div
        ref={contentRef}
        className="max-w-2xl mx-auto space-y-8"
      >
        <h1 className="text-2xl">Hi, I'm Neil.</h1>
        
        <p>
          I'm a startup & tech enthusiast, <span 
            className="interactive-text"
            onMouseEnter={handleBananagramsHoverStart}
            onMouseLeave={handleBananagramsHoverEnd}
          >bananagrams</span> champ (at least in my house), and amateur pickleball aficionado.
        </p>
        
        <p>
          This site is still a work in progress, I have no clue what it's end state will be.
        </p>
        
        <p>
          I spent the last 5.5 years building and scaling a company (BusRight) that was creating the software that powers our nation's largest mass transit system: school buses. I joined as employee #1 before we had any customers or much of a product and recently wrapped up that chapter as our Head of Operations & Customer Experience following our Series B. I had a ton of fun.
        </p>
        
        <p>
          Before that, I invested in and supported founders at DormRoomFund and Northeastern University.
        </p>
        
        <p>
          I'm not sure what's next for me — I'm honestly a little <span 
            className="interactive-text"
            onMouseEnter={handleLostHoverStart}
            onMouseLeave={handleLostHoverEnd}
          >lost</span>, but that's part of the process. I'm a tinkerer by nature, so I might find myself posting fun projects here.
        </p>
        
        <p>
          You can connect with me on socials (I'm more of a lurker) or shoot me an email at bhammar.neil@gmail.com.
        </p>
        
        {/* Social icons */}
        <div className="flex space-x-4 py-2">
          <a 
            href="mailto:bhammar.neil@gmail.com"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="Email"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
          
          <a 
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="Twitter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Flashlight effect overlay with blur */}
      {flashlightActive && (
        <div 
          ref={flashlightRef}
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[999] transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`
          }}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-white opacity-30 hover:opacity-100 transition-opacity pointer-events-auto"
            onClick={() => setFlashlightActive(false)}
            aria-label="Close flashlight effect"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      {/* Container for tiles effect */}
      <div 
        ref={tilesContainerRef}
        className="fixed inset-0 pointer-events-none z-[999]"
      >
        {tilesActive && (
          <button 
            className="absolute top-4 right-4 text-black opacity-30 hover:opacity-100 transition-opacity pointer-events-auto"
            onClick={() => setTilesActive(false)}
            aria-label="Close tiles effect"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      {/* Hover indicators */}
      {/* We can remove this hover indicator since the CSS animation now shows progress */}
    </main>
  );
};

export default UltraMinimal;