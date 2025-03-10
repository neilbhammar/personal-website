import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import copy from 'clipboard-copy';

const UltraMinimal = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [bananagramsActive, setBananagramsActive] = useState(false);
  const [busesActive, setBusesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const bananagramsRef = useRef<HTMLSpanElement>(null);
  const busesRef = useRef<HTMLSpanElement>(null);
  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lostHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const busesHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial mouse position when flashlight is activated
  const initializeFlashlightPosition = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY + window.scrollY
    });
  };
  
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

  // Auto-disable effects after 8 seconds
  useEffect(() => {
    if (flashlightActive || bananagramsActive || busesActive) {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      
      effectTimeoutRef.current = setTimeout(() => {
        setFlashlightActive(false);
        setBananagramsActive(false);
        setBusesActive(false);
      }, 8000);
    }
    
    return () => {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, [flashlightActive, bananagramsActive, busesActive]);
  
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
  
  // Bananagrams tile effect
  const handleBananagramsHoverStart = () => {
    if (bananagramsHoverTimerRef.current) return;
    
    bananagramsHoverTimerRef.current = setTimeout(() => {
      setBananagramsActive(true);
      bananagramsHoverTimerRef.current = null;
      
      // Apply the tile effect animation
      if (bananagramsRef.current) {
        const letters = bananagramsRef.current.textContent?.split('') || [];
        bananagramsRef.current.innerHTML = '';
        
        letters.forEach((letter, index) => {
          const tile = document.createElement('span');
          tile.className = 'bananagram-tile';
          tile.textContent = letter;
          tile.style.display = 'inline-block';
          tile.style.backgroundColor = '#f8f0d8';
          tile.style.border = '1px solid #e6d6b5';
          tile.style.borderRadius = '3px';
          tile.style.padding = '2px 3px';
          tile.style.margin = '0 1px';
          tile.style.fontFamily = 'monospace';
          tile.style.fontSize = '0.9em';
          tile.style.fontWeight = 'bold';
          tile.style.color = '#000';
          tile.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          tile.style.transform = 'scale(0)';
          
          bananagramsRef.current?.appendChild(tile);
          
          // Animate each tile popping in
          gsap.to(tile, {
            scale: 1,
            duration: 0.3,
            delay: index * 0.05,
            ease: 'back.out(1.7)',
          });
        });
      }
    }, 2000); // 2 second delay
  };
  
  const handleBananagramsHoverEnd = () => {
    if (bananagramsHoverTimerRef.current) {
      clearTimeout(bananagramsHoverTimerRef.current);
      bananagramsHoverTimerRef.current = null;
    }
  };
  
  // Clean up bananagrams effect
  useEffect(() => {
    if (!bananagramsActive && bananagramsRef.current) {
      // Return to normal text when effect is turned off
      if (bananagramsRef.current.textContent !== 'bananagrams') {
        bananagramsRef.current.textContent = 'bananagrams';
      }
    }
  }, [bananagramsActive]);
  
  // Handle hover on "lost"
  const handleLostHoverStart = (e: React.MouseEvent) => {
    if (lostHoverTimerRef.current) return;
    
    // Pre-set the mouse position so the flashlight starts in the right place
    initializeFlashlightPosition(e);
    
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

  // School buses effect
  const handleBusesHoverStart = () => {
    if (busesHoverTimerRef.current) return;
    
    busesHoverTimerRef.current = setTimeout(() => {
      setBusesActive(true);
      busesHoverTimerRef.current = null;
      
      // Apply the school bus animation
      if (busesRef.current) {
        // Create bus animation elements
        const busCount = 3; // Multiple buses
        
        for (let i = 0; i < busCount; i++) {
          const busContainer = document.createElement('div');
          busContainer.className = 'bus-container';
          busContainer.style.position = 'fixed';
          busContainer.style.left = '-150px';
          busContainer.style.bottom = `${60 + (i * 40)}px`;
          busContainer.style.zIndex = '100';
          busContainer.style.transform = 'scale(0.5)';
          busContainer.style.transformOrigin = 'center';
          
          // Create the bus
          const bus = document.createElement('div');
          bus.className = 'bus';
          bus.style.width = '100px';
          bus.style.height = '40px';
          bus.style.backgroundColor = '#FFDD00';
          bus.style.borderRadius = '8px';
          bus.style.position = 'relative';
          bus.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          
          // Create the windows
          const windowCount = 3;
          for (let j = 0; j < windowCount; j++) {
            const busWindow = document.createElement('div');
            busWindow.style.width = '15px';
            busWindow.style.height = '15px';
            busWindow.style.backgroundColor = '#87CEEB';
            busWindow.style.position = 'absolute';
            busWindow.style.top = '5px';
            busWindow.style.left = `${25 + (j * 20)}px`;
            busWindow.style.borderRadius = '3px';
            bus.appendChild(busWindow);
          }
          
          // Create the wheels
          for (let j = 0; j < 2; j++) {
            const wheel = document.createElement('div');
            wheel.style.width = '15px';
            wheel.style.height = '15px';
            wheel.style.backgroundColor = '#333';
            wheel.style.borderRadius = '50%';
            wheel.style.position = 'absolute';
            wheel.style.bottom = '-8px';
            wheel.style.left = j === 0 ? '15px' : '70px';
            bus.appendChild(wheel);
          }
          
          busContainer.appendChild(bus);
          document.body.appendChild(busContainer);
          
          // Animate the bus moving across the screen
          gsap.to(busContainer, {
            x: window.innerWidth + 150,
            duration: 6 - (i * 0.5),
            delay: i * 0.5,
            ease: 'power1.inOut',
            onComplete: () => {
              document.body.removeChild(busContainer);
              if (i === busCount - 1) {
                setBusesActive(false);
              }
            }
          });
          
          // Slightly bounce the bus
          gsap.to(bus, {
            y: -3,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        }
      }
    }, 2000); // 2 second delay
  };
  
  const handleBusesHoverEnd = () => {
    if (busesHoverTimerRef.current) {
      clearTimeout(busesHoverTimerRef.current);
      busesHoverTimerRef.current = null;
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
      if (busesHoverTimerRef.current) {
        clearTimeout(busesHoverTimerRef.current);
      }
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <main className="py-10 px-8 md:py-16 md:px-16 relative">
      <div
        ref={contentRef}
        className="max-w-2xl mx-auto space-y-8"
      >
        <h1 className="text-2xl">Hi, I'm Neil.</h1>
        
        <p>
          I'm a startup & tech enthusiast, <span 
            ref={bananagramsRef}
            className="interactive-text"
            onMouseEnter={handleBananagramsHoverStart}
            onMouseLeave={handleBananagramsHoverEnd}
          >bananagrams</span> champ (at least in my house), and amateur pickleball aficionado.
        </p>
        
        <p>
          This site is still a work in progress, I have no clue what it's end state will be.
        </p>
        
        <p>
          I spent the last 5.5 years building and scaling a company (<a href="https://www.busright.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">BusRight</a>) that was creating the software that powers our nation's largest mass transit system: <span 
            ref={busesRef}
            className="interactive-text"
            onMouseEnter={handleBusesHoverStart}
            onMouseLeave={handleBusesHoverEnd}
          >school buses</span>. I joined as employee #1 before we had any customers or much of a product and recently wrapped up that chapter as our Head of Operations & Customer Experience following our Series B. I had a ton of fun.
        </p>
        
        <p>
          Before that, I invested in and supported founders at <a href="#" className="text-blue-600 hover:underline">Dorm Room Fund</a> (a $12.5M pre-seed fund) and Northeastern University.
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
          
          {/* X Logo (formerly Twitter) - Corrected */}
          <a 
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="X (Twitter)"
          >
            {/* Proper X logo */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          
          {/* LinkedIn */}
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
      
      {/* Toast message */}
      <div className={`copy-toast ${showToast ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </main>
  );
};

export default UltraMinimal;