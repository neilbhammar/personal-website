import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import copy from 'clipboard-copy';

const UltraMinimal = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [tilesActive, setTilesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lostHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  // Handle copy to clipboard with toast
  const handleCopyEmail = (email: string) => {
    copy(email).then(() => {
      setToastMessage('Email copied to clipboard!');
      setShowToast(true);
      
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    });
  };
  
  // Handle hover on bananagrams
  const handleBananagramsHoverStart = () => {
    if (bananagramsHoverTimerRef.current) return;
    
    bananagramsHoverTimerRef.current = setTimeout(() => {
      setTilesActive(true);
      bananagramsHoverTimerRef.current = null;
    }, 2000); // 2 second delay
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
    }, 2000); // 2 second delay
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
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);
  
  // Extract letters from all text paragraphs on the page
  const createTilesEffect = () => {
    if (!tilesContainerRef.current || !contentRef.current) return;
    
    // Clear previous tiles
    tilesContainerRef.current.innerHTML = '';
    
    // Get all text from the visible paragraphs
    const paragraphs = contentRef.current.querySelectorAll('p');
    let allLetters: HTMLElement[] = [];
    
    // For each paragraph in the content
    paragraphs.forEach(paragraph => {
      // Get the text content and position of the paragraph
      const text = paragraph.innerText;
      const rect = paragraph.getBoundingClientRect();
      
      // Split the text into individual characters
      const characters = text.split('');
      
      characters.forEach((char, index) => {
        // Skip spaces and special characters
        if (!/[a-zA-Z0-9]/.test(char)) return;
        
        // Create tile element for this character
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = char;
        tile.style.position = 'fixed';
        tile.style.fontFamily = 'monospace';
        tile.style.fontSize = '14px';
        tile.style.opacity = '1'; // Start visible in place
        tile.style.pointerEvents = 'none';
        
        // Calculate position based on paragraph position and character index
        // This is an estimation as we don't have exact character positions
        const approxLeft = rect.left + (index % 40) * 8; // Rough estimation based on char width
        const approxTop = rect.top + Math.floor(index / 40) * 20; // Rough estimation based on line height
        
        // Position at original text location
        gsap.set(tile, {
          x: approxLeft,
          y: approxTop,
          opacity: 1
        });
        
        allLetters.push(tile);
        tilesContainerRef.current?.appendChild(tile);
      });
    });
    
    // Now animate all letters falling down
    allLetters.forEach((tile) => {
      // Randomize the fall timing slightly
      const delay = Math.random() * 0.5;
      
      // Get current position
      const startX = parseFloat(tile.style.transform.split('translateX(')[1]?.split('px')[0] || '0');
      const startY = parseFloat(tile.style.transform.split('translateY(')[1]?.split('px')[0] || '0');
      
      // Animate the fall
      gsap.to(tile, {
        duration: 1.5 + (Math.random() * 1),
        x: startX + (-30 + Math.random() * 60), // Random horizontal movement
        y: window.innerHeight + 50, // Below bottom of screen
        rotation: -40 + Math.random() * 80, // Random rotation
        delay,
        ease: 'power1.in'
      });
    });
    
    // Set timer to clean up after animation completes
    setTimeout(() => {
      if (tilesContainerRef.current) {
        tilesContainerRef.current.innerHTML = '';
      }
      setTilesActive(false);
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
          {/* Email - Copy to clipboard */}
          <button
            onClick={() => handleCopyEmail('bhammar.neil@gmail.com')}
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="Copy email to clipboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </button>
          
          {/* X Logo (formerly Twitter) */}
          <a 
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.5 11.5M4 20l16-16"/>
              <path d="M20 4v16"/>
              <path d="M4 12h8"/>
            </svg>
          </a>
          
          {/* LinkedIn instead of GitHub */}
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
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
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`
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
      
      {/* Toast message */}
      <div className={`copy-toast ${showToast ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </main>
  );
};

export default UltraMinimal;