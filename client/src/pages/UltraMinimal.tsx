import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import copy from 'clipboard-copy';
import ExperienceTooltip from '../components/ExperienceTooltip';
import { experiences } from '../data/experiences';

const UltraMinimal = () => {
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [bananagramsActive, setBananagramsActive] = useState(false);
  const [bananagramsTriggered, setBananagramsTriggered] = useState(false);
  const [busesActive, setBusesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Experience tooltip states
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const bananagramsRef = useRef<HTMLSpanElement>(null);
  const busesRef = useRef<HTMLSpanElement>(null);
  const busrightRef = useRef<HTMLAnchorElement>(null);
  const dormRoomFundRef = useRef<HTMLAnchorElement>(null);
  const northeasternRef = useRef<HTMLAnchorElement>(null);

  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lostHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const busesHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const experienceHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Auto-disable effects after 5 seconds
  useEffect(() => {
    if (flashlightActive || bananagramsActive || busesActive) {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }

      effectTimeoutRef.current = setTimeout(() => {
        setFlashlightActive(false);
        setBananagramsActive(false);
        setBusesActive(false);
      }, 5000);
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
    if (bananagramsTriggered) return; // Prevent re-triggering

    if (bananagramsHoverTimerRef.current) return;

    bananagramsHoverTimerRef.current = setTimeout(() => {
      setBananagramsActive(true);
      setBananagramsTriggered(true); // Set the flag after triggering
      bananagramsHoverTimerRef.current = null;

      // Apply the tile effect animation
      if (bananagramsRef.current) {
        // Save original text content to reset later
        const originalText = bananagramsRef.current.textContent || 'bananagrams';

        // Create spans for each letter of the original text
        const letters = originalText.split('');
        bananagramsRef.current.textContent = ''; // Clear the element

        const letterElements: HTMLSpanElement[] = [];

        // Create initial letter spans
        letters.forEach(letter => {
          const letterSpan = document.createElement('span');
          letterSpan.textContent = letter;
          letterSpan.style.display = 'inline-block';
          bananagramsRef.current!.appendChild(letterSpan);
          letterElements.push(letterSpan);
        });

        // Animate each letter one by one
        letters.forEach((letter, index) => {
          // Replace letters sequentially
          setTimeout(() => {
            if (!letterElements[index]) return; // Safety check

            // Create tile element
            const tile = document.createElement('span');
            tile.textContent = letter;
            tile.className = 'bananagram-tile';
            tile.style.backgroundColor = '#f8f0d0';
            tile.style.border = '1px solid #ddd';
            tile.style.borderRadius = '3px';
            tile.style.padding = '1px 3px';
            tile.style.margin = '0 1px';
            tile.style.fontFamily = 'monospace';
            tile.style.fontSize = '0.9em';
            tile.style.fontWeight = 'bold';
            tile.style.color = '#000';
            tile.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            tile.style.transformOrigin = 'center';
            tile.style.transform = 'rotateY(90deg)';

            // First make the letter disappear
            gsap.to(letterElements[index], {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                // Replace the original letter with the tile
                if (letterElements[index] && letterElements[index].parentNode) {
                  letterElements[index].parentNode.replaceChild(tile, letterElements[index]);

                  // Animate the tile flipping in
                  gsap.to(tile, {
                    rotateY: 0,
                    duration: 0.4,
                    ease: 'back.out(1.2)',
                  });
                }
              }
            });
          }, index * 150); // Stagger the replacement of each letter
        });
      }
    }, 1000); // 1 second delay
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
        // Clear existing content and reset to original text
        while (bananagramsRef.current.firstChild) {
          bananagramsRef.current.removeChild(bananagramsRef.current.firstChild);
        }
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
    }, 1000); // 1 second delay
  };

  const handleLostHoverEnd = () => {
    if (lostHoverTimerRef.current) {
      clearTimeout(lostHoverTimerRef.current);
      lostHoverTimerRef.current = null;
    }
  };

  // School buses effect - much more subtle and polished
  const handleBusesHoverStart = () => {
    if (busesHoverTimerRef.current) return;

    busesHoverTimerRef.current = setTimeout(() => {
      setBusesActive(true);
      busesHoverTimerRef.current = null;

      if (busesRef.current) {
        // Apply a subtle highlight effect to the text first
        busesRef.current && gsap.to(busesRef.current, {
          backgroundColor: 'rgba(255, 221, 0, 0.2)',
          borderRadius: '3px',
          padding: '0 4px',
          duration: 0.5
        });

        // Create a small map/route visualization next to the text
        const routeContainer = document.createElement('div');
        routeContainer.className = 'route-container';
        routeContainer.style.position = 'absolute';
        routeContainer.style.top = '100%';
        routeContainer.style.left = '0';
        routeContainer.style.width = '100%';
        routeContainer.style.height = '2px';
        routeContainer.style.background = '#FFDD00';
        routeContainer.style.marginTop = '2px';
        routeContainer.style.borderRadius = '1px';
        routeContainer.style.opacity = '0';

        // Add small stop points along the route
        const stopCount = 5;
        for (let i = 0; i < stopCount; i++) {
          const stop = document.createElement('div');
          stop.style.position = 'absolute';
          stop.style.width = '4px';
          stop.style.height = '4px';
          stop.style.borderRadius = '50%';
          stop.style.backgroundColor = 'white';
          stop.style.border = '1px solid rgba(0,0,0,0.2)';
          stop.style.top = '-2px';
          stop.style.left = `${(i+1) * (100 / (stopCount+1))}%`;
          stop.style.transform = 'scale(0)';

          routeContainer.appendChild(stop);

          // Animate each stop appearing
          gsap.to(stop, {
            scale: 1,
            delay: 0.3 + (i * 0.1),
            duration: 0.2,
            ease: 'back.out'
          });
        }

        // Create a tiny bus that moves along the route
        const miniBus = document.createElement('div');
        miniBus.style.position = 'absolute';
        miniBus.style.width = '8px';
        miniBus.style.height = '6px';
        miniBus.style.backgroundColor = '#FFDD00';
        miniBus.style.borderRadius = '2px';
        miniBus.style.top = '-3px';
        miniBus.style.left = '0';
        miniBus.style.transform = 'translateX(-50%)';
        miniBus.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

        routeContainer.appendChild(miniBus);
        busesRef.current.appendChild(routeContainer);

        // Animate the route appearing
        gsap.to(routeContainer, {
          opacity: 1,
          duration: 0.3
        });

        // Animate the bus moving along the route
        gsap.to(miniBus, {
          left: '100%',
          duration: 3,
          ease: 'power1.inOut',
          onComplete: () => {
            // Fade out the route when finished
            gsap.to(routeContainer, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                // Reset the text styling
                busesRef.current && gsap.to(busesRef.current, {
                  backgroundColor: 'transparent',
                  padding: '0',
                  duration: 0.5,
                  onComplete: () => {
                    if (busesRef.current && busesRef.current.contains(routeContainer)) {
                      busesRef.current.removeChild(routeContainer);
                    }
                    setBusesActive(false);
                  }
                });
              }
            });
          }
        });
      }
    }, 1000); // 1 second delay
  };

  const handleBusesHoverEnd = () => {
    if (busesHoverTimerRef.current) {
      clearTimeout(busesHoverTimerRef.current);
      busesHoverTimerRef.current = null;
    }
  };

  // Handle tooltip click-outside close
  useEffect(() => {
    if (!tooltipVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Close tooltip if clicking outside
      if (tooltipVisible && 
          !e.target.closest('.experience-tooltip') && 
          !e.target.closest('a[ref]')) {
        setTooltipVisible(false);
        setTimeout(() => setActiveExperience(null), 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tooltipVisible]);

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
      if (experienceHoverTimerRef.current) {
        clearTimeout(experienceHoverTimerRef.current);
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
          I spent the last 5.5 years building and scaling a company (<a 
            ref={busrightRef}
            href="https://www.busright.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
            onMouseEnter={() => {
              if (experienceHoverTimerRef.current) return;
              experienceHoverTimerRef.current = setTimeout(() => {
                setActiveExperience('busright');
                setTooltipVisible(true);
                experienceHoverTimerRef.current = null;
              }, 1000);
            }}
            onMouseLeave={() => {
              if (experienceHoverTimerRef.current) {
                clearTimeout(experienceHoverTimerRef.current);
                experienceHoverTimerRef.current = null;
              }
            }}
          >BusRight</a>) that was creating the software that powers our nation's largest mass transit system: <span 
            ref={busesRef}
            className="interactive-text"
            onMouseEnter={handleBusesHoverStart}
            onMouseLeave={handleBusesHoverEnd}
          >school buses</span>. I joined as employee #1 before we had any customers or much of a product and recently wrapped up that chapter as our Head of Operations & Customer Experience following our Series B. I had a ton of fun.
        </p>

        <p>
          Before that, I invested in and supported founders at <a 
            ref={dormRoomFundRef}
            href="https://www.dormroomfund.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onMouseEnter={() => {
              if (experienceHoverTimerRef.current) return;
              experienceHoverTimerRef.current = setTimeout(() => {
                setActiveExperience('dormRoomFund');
                setTooltipVisible(true);
                experienceHoverTimerRef.current = null;
              }, 1000);
            }}
            onMouseLeave={() => {
              if (experienceHoverTimerRef.current) {
                clearTimeout(experienceHoverTimerRef.current);
                experienceHoverTimerRef.current = null;
              }
            }}
          >Dorm Room Fund</a> and <span
            ref={northeasternRef}
            onMouseEnter={() => {
              if (experienceHoverTimerRef.current) return;
              experienceHoverTimerRef.current = setTimeout(() => {
                setActiveExperience('northeastern');
                setTooltipVisible(true);
                experienceHoverTimerRef.current = null;
              }, 1000);
            }}
            onMouseLeave={() => {
              if (experienceHoverTimerRef.current) {
                clearTimeout(experienceHoverTimerRef.current);
                experienceHoverTimerRef.current = null;
              }
            }}
          >Northeastern University</span>.
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

      {/* Experience tooltips */}
      {activeExperience && (
        <ExperienceTooltip
          data={experiences[activeExperience]}
          visible={tooltipVisible}
          anchorRef={
            activeExperience === 'busright' 
              ? busrightRef 
              : activeExperience === 'dormRoomFund'
                ? dormRoomFundRef
                : northeasternRef
          }
          onClose={() => {
            setTooltipVisible(false);
            setTimeout(() => setActiveExperience(null), 300);
          }}
        />
      )}
    </main>
  );
};

export default UltraMinimal;
import React from 'react';
import CanvasAnimation from '@/components/CanvasAnimation';
import ExperienceTooltip from '@/components/ExperienceTooltip';
import FeatureFlagControls from '@/components/FeatureFlagControls';
import { useEnhancedTooltip } from '@/hooks/use-enhanced-tooltip';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';

// Sample data for tooltips
const experiences = {
  busright: {
    title: "That time a customer got a tattoo of our logo.",
    description: "Pretty sure this is unheard of in SaaS. I mean who tattoos a SaaS logo? This felt pretty damn good.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  frontend: {
    title: "Frontend Development",
    description: "React, Next.js, TypeScript, Tailwind CSS, and more.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  backend: {
    title: "Backend Development",
    description: "Node.js, Express, PostgreSQL, MongoDB, and more.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  }
};

const UltraMinimal: React.FC = () => {
  const { 
    activeTooltip, 
    anchorRef, 
    hideTooltip, 
    createTooltipTrigger,
    tooltipPosition
  } = useEnhancedTooltip();

  return (
    <FeatureFlagProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <CanvasAnimation />
        
        <main className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-6">Interactive Demo</h1>
          
          <p className="text-lg mb-8">
            I was building a company ({
              createTooltipTrigger('busright', <span className="text-blue-500 font-medium">BusRight</span>)
            }) that was creating incredible customer experiences. Our focus was on 
            building amazing teams and amazing customer experience following our 
            {createTooltipTrigger('frontend', <span className="ml-1 text-blue-500">frontend</span>)} and 
            {createTooltipTrigger('backend', <span className="ml-1 text-blue-500">backend</span>)} best practices.
          </p>
          
          {/* Enhanced tooltips for each keyword */}
          {activeTooltip === 'busright' && (
            <ExperienceTooltip
              data={experiences.busright}
              visible={activeTooltip === 'busright'}
              anchorRef={anchorRef}
              onClose={hideTooltip}
              position={tooltipPosition}
            />
          )}
          
          {activeTooltip === 'frontend' && (
            <ExperienceTooltip
              data={experiences.frontend}
              visible={activeTooltip === 'frontend'}
              anchorRef={anchorRef}
              onClose={hideTooltip}
              position={tooltipPosition}
            />
          )}
          
          {activeTooltip === 'backend' && (
            <ExperienceTooltip
              data={experiences.backend}
              visible={activeTooltip === 'backend'}
              anchorRef={anchorRef}
              onClose={hideTooltip}
              position={tooltipPosition}
            />
          )}
        </main>
        
        {/* Controls to toggle features */}
        <FeatureFlagControls />
      </div>
    </FeatureFlagProvider>
  );
};

export default UltraMinimal;
