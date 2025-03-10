import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const UltraMinimal = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [tilesActive, setTilesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Create tiles animation
  const createTilesEffect = () => {
    if (!tilesContainerRef.current) return;
    
    // Clear previous tiles
    tilesContainerRef.current.innerHTML = '';
    
    // Create tiles for each letter
    const word = "bananagrams";
    const chars = word.split('');
    
    chars.forEach((char, index) => {
      // Create tile element
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = char;
      tile.style.position = 'fixed';
      tile.style.fontFamily = 'monospace';
      tile.style.fontSize = '16px';
      tile.style.opacity = '0';
      tile.style.pointerEvents = 'none';
      
      // Add to container
      tilesContainerRef.current?.appendChild(tile);
      
      // Calculate position based on mouse or viewport center
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const startX = viewportWidth * 0.5 + (Math.random() * 100 - 50);
      const startY = viewportHeight * 0.3;
      
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
        delay: index * 0.06,
        ease: 'power1.in',
        onComplete: () => {
          if (index === chars.length - 1) {
            setTimeout(() => {
              if (tilesContainerRef.current) {
                tilesContainerRef.current.innerHTML = '';
              }
              setTilesActive(false);
            }, 500);
          }
        }
      });
    });
  };
  
  // Trigger the tiles effect when activated
  useEffect(() => {
    if (tilesActive) {
      createTilesEffect();
    }
  }, [tilesActive]);
  
  return (
    <main className="py-10 px-8 md:py-16 md:px-16">
      <div
        ref={contentRef}
        className="max-w-2xl mx-auto space-y-8"
      >
        <h1 className="text-2xl">Hi, I'm Neil.</h1>
        
        <p>
          I'm a startup & tech enthusiast, <span 
            className="interactive-text"
            onClick={() => setTilesActive(true)}
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
            onClick={() => setFlashlightActive(!flashlightActive)}
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
      
      {/* Flashlight effect overlay */}
      {flashlightActive && (
        <div 
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[999] transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            maskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`
          }}
        />
      )}
      
      {/* Container for tiles effect */}
      <div 
        ref={tilesContainerRef}
        className="fixed inset-0 pointer-events-none z-[999]"
      />
    </main>
  );
};

export default UltraMinimal;