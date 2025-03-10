import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import copy from 'clipboard-copy';
import ExperienceTooltip from '../components/ExperienceTooltip';
import { experiences } from '../data/experiences';
// Import Feature Flag Context
import { useFeatureFlags } from '../contexts/FeatureFlagContext';


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
  const [anchorRef, setAnchorRef] = useState<React.RefObject<HTMLAnchorElement> | null>(null);


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

  // Advanced school buses animation effect
  const handleBusesHoverStart = () => {
    const { flags } = useFeatureFlags();
    if (!flags.animations) return; // Skip animation if disabled
    if (busesHoverTimerRef.current) return;

    busesHoverTimerRef.current = setTimeout(() => {
      setBusesActive(true);
      busesHoverTimerRef.current = null;

      // Create advanced bus animation
      if (busesRef.current) {
        // First clear any existing content and save original text
        const originalText = busesRef.current.textContent || 'school buses';
        busesRef.current.innerHTML = '';

        // Create vehicle animation container
        const animationContainer = document.createElement('div');
        animationContainer.className = 'bus-animation-container';
        busesRef.current.appendChild(animationContainer);

        // Create road
        const road = document.createElement('div');
        road.className = 'bus-animation-road';
        animationContainer.appendChild(road);

        // Create school bus
        const bus = document.createElement('div');
        bus.className = 'bus-animation-vehicle';
        bus.innerHTML = `
          <div class="bus-body">
            <div class="bus-window-front"></div>
            ${Array(4).fill(0).map(() => '<div class="bus-window"></div>').join('')}
            <div class="bus-door"></div>
            <div class="bus-lights">
              <div class="bus-light-front"></div>
              <div class="bus-light-back"></div>
            </div>
            <div class="bus-wheels">
              <div class="bus-wheel bus-wheel-front"></div>
              <div class="bus-wheel bus-wheel-back"></div>
            </div>
            <div class="bus-sign">SCHOOL BUS</div>
          </div>
        `;
        road.appendChild(bus);

        // Animate the bus
        gsap.fromTo(bus, 
          { x: -100, rotation: -2 },
          { 
            x: '120%', 
            duration: 3, 
            ease: "power1.inOut",
            onComplete: () => {
              // Show original text with highlight
              busesRef.current.innerHTML = originalText;
              busesRef.current.classList.add('school-bus-highlight');

              // Add small bus icon
              const busIcon = document.createElement('span');
              busIcon.className = 'bus-icon';
              busIcon.innerHTML = '🚌';
              busesRef.current.appendChild(busIcon);

              // Animate icon
              gsap.fromTo(busIcon, 
                { scale: 0, rotation: -30 },
                { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
              );
            }
          }
        );

        // Animate wheels
        const wheels = bus.querySelectorAll('.bus-wheel');
        gsap.to(wheels, {
          rotation: 360,
          duration: 0.8,
          repeat: 5,
          ease: "none"
        });

        // Add bouncing effect
        gsap.to(bus, {
          y: '-=5',
          duration: 0.3,
          repeat: 20,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, 500);
  };

  const handleBusesHoverEnd = () => {
    if (busesHoverTimerRef.current) {
      clearTimeout(busesHoverTimerRef.current);
      busesHoverTimerRef.current = null;
    }

    if (busesActive) {
      // Remove animation after a delay
      effectTimeoutRef.current = setTimeout(() => {
        if (busesRef.current) {
          busesRef.current.classList.remove('school-bus-highlight');
          // Remove any bus icons
          const busIcon = busesRef.current.querySelector('.bus-icon');
          if (busIcon) {
            gsap.to(busIcon, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                if (busIcon.parentNode) {
                  busIcon.parentNode.removeChild(busIcon);
                }
              }
            });
          }
        }
        setBusesActive(false);
      }, 3000);
    }
  };

  // Experience tooltip handler with feature flag support
  const handleExperienceHover = (experienceId: string, anchorRef: React.RefObject<HTMLAnchorElement>) => {
    const { flags } = useFeatureFlags();
    if (!flags.tooltips) return; // Skip tooltip if disabled

    if (experienceHoverTimerRef.current) {
      clearTimeout(experienceHoverTimerRef.current);
    }

    experienceHoverTimerRef.current = setTimeout(() => {
      setActiveExperience(experienceId);
      setAnchorRef(anchorRef);
      setTooltipVisible(true);
      experienceHoverTimerRef.current = null;
    }, 300);
  };

  const handleExperienceLeave = () => {
    if (experienceHoverTimerRef.current) {
      clearTimeout(experienceHoverTimerRef.current);
      experienceHoverTimerRef.current = null;
    }
    setTooltipVisible(false);
    setTimeout(() => setActiveExperience(null), 300);
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
    <FeatureFlagProvider> {/* Wrap with FeatureFlagProvider */}
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
            onMouseEnter={() => handleExperienceHover('busright', busrightRef)}
            onMouseLeave={handleExperienceLeave}
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
            onMouseEnter={() => handleExperienceHover('dormRoomFund', dormRoomFundRef)}
            onMouseLeave={handleExperienceLeave}
          >Dorm Room Fund</a> and <span
            ref={northeasternRef}
            onMouseEnter={() => handleExperienceHover('northeastern', northeasternRef)}
            onMouseLeave={handleExperienceLeave}
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
      {tooltipVisible && activeExperience && anchorRef && (
        <ExperienceTooltip
          data={experiences.find((exp) => exp.id === activeExperience) || experiences[0]}
          visible={tooltipVisible}
          anchorRef={anchorRef}
          position="top"
          onClose={() => {
            setTooltipVisible(false);
            setTimeout(() => setActiveExperience(null), 300);
          }}
        />
      )}
    </main>
    </FeatureFlagProvider>
  );
};

export default UltraMinimal;