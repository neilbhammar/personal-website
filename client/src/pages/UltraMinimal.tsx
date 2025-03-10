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

  // Professional school buses animation with data visualization aesthetic
  const handleBusesHoverStart = () => {
    if (busesHoverTimerRef.current) return;

    busesHoverTimerRef.current = setTimeout(() => {
      if (busesRef.current && !busesActive) {
        setBusesActive(true);

        // Create SVG container for high-quality animation
        const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttribute("width", "100%");
        svgContainer.setAttribute("height", "80");
        svgContainer.setAttribute("viewBox", "0 0 400 80");
        svgContainer.style.position = "absolute";
        svgContainer.style.top = "100%";
        svgContainer.style.left = "0";
        svgContainer.style.opacity = "0";
        svgContainer.style.overflow = "visible";

        // Create defs for gradients and filters
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

        // Create gradient for route
        const routeGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        routeGradient.setAttribute("id", "routeGradient");
        routeGradient.setAttribute("x1", "0%");
        routeGradient.setAttribute("y1", "0%");
        routeGradient.setAttribute("x2", "100%");
        routeGradient.setAttribute("y2", "0%");

        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#2563eb");

        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#3b82f6");

        routeGradient.appendChild(stop1);
        routeGradient.appendChild(stop2);

        // Create glow filter
        const glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        glowFilter.setAttribute("id", "glow");
        glowFilter.setAttribute("x", "-20%");
        glowFilter.setAttribute("y", "-20%");
        glowFilter.setAttribute("width", "140%");
        glowFilter.setAttribute("height", "140%");

        const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        feGaussianBlur.setAttribute("stdDeviation", "2");
        feGaussianBlur.setAttribute("result", "blur");

        const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
        feComposite.setAttribute("in", "SourceGraphic");
        feComposite.setAttribute("in2", "blur");
        feComposite.setAttribute("operator", "over");

        glowFilter.appendChild(feGaussianBlur);
        glowFilter.appendChild(feComposite);

        defs.appendChild(routeGradient);
        defs.appendChild(glowFilter);
        svgContainer.appendChild(defs);

        // Create the route path
        const routePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        routePath.setAttribute("d", "M0,40 C100,20 300,60 400,40");
        routePath.setAttribute("stroke", "url(#routeGradient)");
        routePath.setAttribute("stroke-width", "3");
        routePath.setAttribute("fill", "none");
        routePath.setAttribute("stroke-dasharray", "400");
        routePath.setAttribute("stroke-dashoffset", "400");
        routePath.setAttribute("filter", "url(#glow)");

        svgContainer.appendChild(routePath);

        // Add data points along the route
        const dataPoints = [
          { x: 50, y: 32, label: "Fleet" },
          { x: 150, y: 43, label: "Routes" },
          { x: 250, y: 30, label: "Safety" },
          { x: 350, y: 38, label: "Efficiency" }
        ];

        dataPoints.forEach((point, index) => {
          // Create point
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("cx", point.x.toString());
          circle.setAttribute("cy", point.y.toString());
          circle.setAttribute("r", "0");
          circle.setAttribute("fill", "#ffffff");
          circle.setAttribute("stroke", "#3b82f6");
          circle.setAttribute("stroke-width", "1.5");
          circle.setAttribute("filter", "url(#glow)");
          circle.style.opacity = "0";

          // Create label
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", point.x.toString());
          text.setAttribute("y", (point.y - 10).toString());
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "8");
          text.setAttribute("fill", "#64748b");
          text.setAttribute("font-family", "Inter, system-ui, sans-serif");
          text.textContent = point.label;
          text.style.opacity = "0";

          svgContainer.appendChild(circle);
          svgContainer.appendChild(text);

          // Animate point and label appearance
          gsap.to(circle, {
            attr: { r: 4 },
            opacity: 1,
            delay: 0.5 + (index * 0.2),
            duration: 0.4,
            ease: "back.out"
          });

          gsap.to(text, {
            opacity: 1,
            delay: 0.6 + (index * 0.2),
            duration: 0.3
          });
        });

        // Create a sophisticated bus icon
        const bus = document.createElementNS("http://www.w3.org/2000/svg", "g");
        bus.setAttribute("transform", "translate(0, 40) scale(0.25)");

        // Bus body
        const busBody = document.createElementNS("http://www.w3.org/2000/svg", "path");
        busBody.setAttribute("d", "M0,0 L60,0 C65,0 70,-5 70,-10 L70,-30 C70,-35 65,-40 60,-40 L10,-40 C5,-40 0,-35 0,-30 L0,0 Z");
        busBody.setAttribute("fill", "#1e40af");
        busBody.setAttribute("stroke", "#1e3a8a");
        busBody.setAttribute("stroke-width", "1");

        // Bus windows
        const busWindows = document.createElementNS("http://www.w3.org/2000/svg", "path");
        busWindows.setAttribute("d", "M10,-35 L60,-35 C62,-35 65,-33 65,-30 L65,-15 C65,-12 62,-10 60,-10 L10,-10 C8,-10 5,-12 5,-15 L5,-30 C5,-33 8,-35 10,-35 Z");
        busWindows.setAttribute("fill", "#93c5fd");
        busWindows.setAttribute("stroke", "#60a5fa");
        busWindows.setAttribute("stroke-width", "0.5");

        // Front lights
        const frontLight = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        frontLight.setAttribute("cx", "5");
        frontLight.setAttribute("cy", "-5");
        frontLight.setAttribute("r", "2");
        frontLight.setAttribute("fill", "#fef3c7");
        frontLight.setAttribute("filter", "url(#glow)");

        // Wheels
        const wheel1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        wheel1.setAttribute("cx", "15");
        wheel1.setAttribute("cy", "0");
        wheel1.setAttribute("r", "5");
        wheel1.setAttribute("fill", "#1f2937");
        wheel1.setAttribute("stroke", "#4b5563");
        wheel1.setAttribute("stroke-width", "1");

        const wheel2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        wheel2.setAttribute("cx", "55");
        wheel2.setAttribute("cy", "0");
        wheel2.setAttribute("r", "5");
        wheel2.setAttribute("fill", "#1f2937");
        wheel2.setAttribute("stroke", "#4b5563");
        wheel2.setAttribute("stroke-width", "1");

        bus.appendChild(busBody);
        bus.appendChild(busWindows);
        bus.appendChild(frontLight);
        bus.appendChild(wheel1);
        bus.appendChild(wheel2);

        svgContainer.appendChild(bus);
        busesRef.current.appendChild(svgContainer);

        // Animate SVG appearance
        gsap.to(svgContainer, {
          opacity: 1,
          duration: 0.4
        });

        // Animate the route appearing
        gsap.to(routePath, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut"
        });

        // Path motion for the bus
        const pathMotion = {
          path: routePath,
          align: "self",
          alignOrigin: [0.1, 0.5],
          autoRotate: true,
          start: 0,
          end: 1
        };

        // Animate the bus moving along the path
        gsap.to(bus, {
          motionPath: pathMotion,
          duration: 4,
          ease: "power1.inOut",
          onUpdate: function() {
            // Add subtle bounce to wheels
            const progress = this.progress();
            const bounceY = Math.sin(progress * Math.PI * 10) * 1;

            gsap.set(wheel1, { 
              attr: { cy: bounceY }
            });
            gsap.set(wheel2, { 
              attr: { cy: bounceY }
            });
          },
          onComplete: () => {
            // Fade out the SVG when finished
            gsap.to(svgContainer, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                // Reset the text styling
                busesRef.current && gsap.to(busesRef.current, {
                  backgroundColor: 'transparent',
                  padding: '0',
                  duration: 0.3,
                  onComplete: () => {
                    if (busesRef.current && busesRef.current.contains(svgContainer)) {
                      busesRef.current.removeChild(svgContainer);
                    }
                    setBusesActive(false);
                  }
                });
              }
            });
          }
        });
      }
    }, 500); // Reduced delay for better responsiveness
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