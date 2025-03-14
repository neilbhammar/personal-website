import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import copy from "clipboard-copy";
import useIsMobile from "../hooks/useIsMobile";
import { trackEvent } from '../services/analytics';

const UltraMinimal = () => {
  const isMobile = useIsMobile();
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [bananagramsActive, setBananagramsActive] = useState(false);
  const [bananagramsTriggered, setBananagramsTriggered] = useState(false);
  const [busesActive, setBusesActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const bananagramsRef = useRef<HTMLSpanElement>(null);
  const busesRef = useRef<HTMLSpanElement>(null);
  const busrightRef = useRef<HTMLAnchorElement>(null);
  const dormRoomFundRef = useRef<HTMLAnchorElement>(null);
  const northeasternRef = useRef<HTMLAnchorElement>(null);
  const funRef = useRef<HTMLSpanElement>(null); //Added ref for new tooltip
  const foundersRef = useRef<HTMLSpanElement>(null); //Added ref for new tooltip

  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lostHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const busesHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const experienceHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const funHoverTimerRef = useRef<NodeJS.Timeout | null>(null); //Added timer for new tooltip
  const foundersHoverTimerRef = useRef<NodeJS.Timeout | null>(null); //Added timer for new tooltip
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial mouse position when flashlight is activated
  const initializeFlashlightPosition = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY + window.scrollY,
    });
  };

  // Update mouse position for flashlight effect
  useEffect(() => {
    if (!flashlightActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY + window.scrollY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
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
      setToastMessage("Email copied to clipboard!");
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
    if (isMobile || bananagramsTriggered) return;
    trackEvent('Interaction', 'hover', 'bananagrams');

    if (bananagramsHoverTimerRef.current) return;

    bananagramsHoverTimerRef.current = setTimeout(() => {
      setBananagramsActive(true);
      setBananagramsTriggered(true); // Set the flag after triggering
      bananagramsHoverTimerRef.current = null;

      // Apply the tile effect animation
      if (bananagramsRef.current) {
        // Save original text content to reset later
        const originalText =
          bananagramsRef.current.textContent || "bananagrams";

        // Create spans for each letter of the original text
        const letters = originalText.split("");
        bananagramsRef.current.textContent = ""; // Clear the element

        const letterElements: HTMLSpanElement[] = [];

        // Create initial letter spans
        letters.forEach((letter) => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = letter;
          letterSpan.style.display = "inline-block";
          bananagramsRef.current!.appendChild(letterSpan);
          letterElements.push(letterSpan);
        });

        // Animate each letter one by one
        letters.forEach((letter, index) => {
          // Replace letters sequentially
          setTimeout(() => {
            if (!letterElements[index]) return; // Safety check

            // Create tile element
            const tile = document.createElement("span");
            tile.textContent = letter;
            tile.className = "bananagram-tile";
            tile.style.backgroundColor = "#f8f0d0";
            tile.style.border = "1px solid #ddd";
            tile.style.borderRadius = "3px";
            tile.style.padding = "1px 3px";
            tile.style.margin = "0 1px";
            tile.style.fontFamily = "monospace";
            tile.style.fontSize = "0.9em";
            tile.style.fontWeight = "bold";
            tile.style.color = "#000";
            tile.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
            tile.style.transformOrigin = "center";
            tile.style.transform = "rotateY(90deg)";

            // First make the letter disappear
            gsap.to(letterElements[index], {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                // Replace the original letter with the tile
                if (letterElements[index] && letterElements[index].parentNode) {
                  letterElements[index].parentNode.replaceChild(
                    tile,
                    letterElements[index],
                  );

                  // Animate the tile flipping in
                  gsap.to(tile, {
                    rotateY: 0,
                    duration: 0.4,
                    ease: "back.out(1.2)",
                  });
                }
              },
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
      if (bananagramsRef.current.textContent !== "bananagrams") {
        // Clear existing content and reset to original text
        while (bananagramsRef.current.firstChild) {
          bananagramsRef.current.removeChild(bananagramsRef.current.firstChild);
        }
        bananagramsRef.current.textContent = "bananagrams";
      }
    }
  }, [bananagramsActive]);

  // Handle hover on "lost"
  const handleLostHoverStart = (e: React.MouseEvent) => {
    if (isMobile || lostHoverTimerRef.current) return;
    trackEvent('Interaction', 'hover', 'lost');

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

  // Enhanced school buses effect with improved animation
  const handleBusesHoverStart = () => {
    if (isMobile || busesHoverTimerRef.current) return;

    busesHoverTimerRef.current = setTimeout(() => {
      setBusesActive(true);
      busesHoverTimerRef.current = null;

      if (busesRef.current) {
        // Apply a subtle highlight effect to the text first
        busesRef.current &&
          gsap.to(busesRef.current, {
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            borderRadius: "3px",
            padding: "0 4px",
            duration: 0.5,
          });

        // Create a small map/route visualization next to the text
        const routeContainer = document.createElement("div");
        routeContainer.className = "route-container";
        routeContainer.style.position = "absolute";
        routeContainer.style.top = "100%";
        routeContainer.style.left = "0";
        routeContainer.style.width = "100%";
        routeContainer.style.height = "4px";
        routeContainer.style.background =
          "linear-gradient(90deg, #4A5568 0%, #2D3748 100%)"; // Darker road color
        routeContainer.style.marginTop = "4px";
        routeContainer.style.borderRadius = "2px";
        routeContainer.style.opacity = "0";
        routeContainer.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";

        // Add road markings
        const roadMarkings = document.createElement("div");
        roadMarkings.style.position = "absolute";
        roadMarkings.style.top = "50%";
        roadMarkings.style.left = "0";
        roadMarkings.style.width = "100%";
        roadMarkings.style.height = "1px";
        roadMarkings.style.background = "repeating-linear-gradient(to right, white 0px, white 5px, transparent 5px, transparent 10px)";
        roadMarkings.style.opacity = "0.7";
        roadMarkings.style.transform = "translateY(-50%)";
        routeContainer.appendChild(roadMarkings);

        // Add small stop points along the route
        const stopCount = 5;
        for (let i = 0; i < stopCount; i++) {
          const stop = document.createElement("div");
          stop.style.position = "absolute";
          stop.style.width = "6px";
          stop.style.height = "6px";
          stop.style.borderRadius = "50%";
          stop.style.backgroundColor = "#E2E8F0";
          stop.style.border = "1px solid rgba(0,0,0,0.2)";
          stop.style.top = "-2px";
          stop.style.left = `${(i + 1) * (100 / (stopCount + 1))}%`;
          stop.style.transform = "scale(0)";
          stop.style.boxShadow = "0 1px 2px rgba(0,0,0,0.15)";

          routeContainer.appendChild(stop);

          // Animate each stop appearing
          gsap.to(stop, {
            scale: 1,
            delay: 0.3 + i * 0.1,
            duration: 0.2,
            ease: "back.out",
          });
        }

        // Create a tiny school bus that moves along the route
        const miniBus = document.createElement("div");
        miniBus.style.position = "absolute";
        miniBus.style.width = "16px";
        miniBus.style.height = "9px";
        miniBus.style.backgroundColor = "#FFDD00";
        miniBus.style.borderRadius = "2px 4px 2px 2px"; // More bus-like shape
        miniBus.style.top = "-5px";
        miniBus.style.left = "0";
        miniBus.style.transform = "translateX(-50%)";
        miniBus.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

        // Add wheels to the bus
        const frontWheel = document.createElement("div");
        frontWheel.style.position = "absolute";
        frontWheel.style.width = "3px";
        frontWheel.style.height = "3px";
        frontWheel.style.borderRadius = "50%";
        frontWheel.style.backgroundColor = "#1A202C";
        frontWheel.style.bottom = "-1px";
        frontWheel.style.right = "2px";

        const rearWheel = document.createElement("div");
        rearWheel.style.position = "absolute";
        rearWheel.style.width = "3px";
        rearWheel.style.height = "3px";
        rearWheel.style.borderRadius = "50%";
        rearWheel.style.backgroundColor = "#1A202C";
        rearWheel.style.bottom = "-1px";
        rearWheel.style.left = "2px";

        // Add windows to the bus for more detail
        const busWindows = document.createElement("div");
        busWindows.style.position = "absolute";
        busWindows.style.top = "2px";
        busWindows.style.left = "2px";
        busWindows.style.right = "3px";
        busWindows.style.height = "3px";
        busWindows.style.backgroundColor = "rgba(148, 212, 255, 0.8)";
        busWindows.style.borderRadius = "1px";

        miniBus.appendChild(frontWheel);
        miniBus.appendChild(rearWheel);
        miniBus.appendChild(busWindows);
        routeContainer.appendChild(miniBus);
        busesRef.current.appendChild(routeContainer);

        // Animate the route appearing
        gsap.to(routeContainer, {
          opacity: 1,
          duration: 0.3,
        });

        // Animate the bus moving along the route with a small bounce effect
        gsap.to(miniBus, {
          left: "100%",
          duration: 3,
          ease: "power1.inOut",
          onUpdate: () => {
            // Add a small up/down motion as the bus moves
            const progress =
              (gsap.getProperty(miniBus, "left") as number) / 100;
            const bounce = Math.sin(progress * Math.PI * 8) * 1.5;
            miniBus.style.top = `${-5 + bounce}px`;

            // Add wheel rotation animation
            const rotation = progress * 1080; // Multiple full rotations
            frontWheel.style.transform = `rotate(${rotation}deg)`;
            rearWheel.style.transform = `rotate(${rotation}deg)`;
          },
          onComplete: () => {
            // Fade out the route when finished
            gsap.to(routeContainer, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                // Reset the text styling
                busesRef.current &&
                  gsap.to(busesRef.current, {
                    backgroundColor: "transparent",
                    padding: "0",
                    duration: 0.5,
                    onComplete: () => {
                      if (
                        busesRef.current &&
                        busesRef.current.contains(routeContainer)
                      ) {
                        busesRef.current.removeChild(routeContainer);
                      }
                      setBusesActive(false);
                    },
                  });
              },
            });
          },
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
      if (funHoverTimerRef.current) {
        clearTimeout(funHoverTimerRef.current);
      }
      if (foundersHoverTimerRef.current) {
        clearTimeout(foundersHoverTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="py-10 px-8 md:py-16 md:px-16 relative flex justify-center items-center min-h-screen">
      <div ref={contentRef} className="max-w-2xl w-full mx-auto space-y-8">
        <h1 className="text-2xl">Hi, I'm Neil.</h1>

        <p>
          I'm a startup enthusiast,{" "}
          <span
            ref={bananagramsRef}
            className="interactive-text"
            onMouseEnter={handleBananagramsHoverStart}
            onMouseLeave={handleBananagramsHoverEnd}
          >
            bananagrams
          </span>{" "}
          champ (at least in my house), and amateur pickleball aficionado.
        </p>
        <p>
          I spent the last 5.5 years building and scaling a company (
          <a
            ref={busrightRef}
            href="https://www.busright.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            BusRight
          </a>
          ) that was creating the software that powers our nation's largest mass
          transit system:{" "}
          <span
            ref={busesRef}
            className="interactive-text"
            onMouseEnter={handleBusesHoverStart}
            onMouseLeave={handleBusesHoverEnd}
          >
            school buses
          </span>
          . I joined as employee #1, before we had any customers or much of a
          product, and had a ton of fun along the way. I recently wrapped up
          that chapter after a 4 year run leading Ops & CX (through our Series
          B). Before that, I invested in and supported founders at{" "}
          <a
            ref={dormRoomFundRef}
            href="https://www.dormroomfund.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Dorm Room Fund
          </a>{" "}
          (a $12.5m pre-seed fund) and Northeastern University.
        </p>

        <p>
          I'm not sure what's next for me — I'm honestly a little{" "}
          <span className="interactive-text" ref={funRef} onMouseEnter={handleLostHoverStart} onMouseLeave={handleLostHoverEnd}>
            lost
          </span>
          , but I know that's part of the process.
        </p>
        <p className="mt-4">
          I'm excited to spend the next few months catching up on learning and tinkering, and I'll probably post some of that <a 
    href="/projects" 
    className="text-foreground hover:text-foreground/90 underline underline-offset-4 decoration-muted-foreground/30"
  > here. </a>
        </p>
        <p className="mt-4">
          You can connect with me on socials or shoot me an email at <a href="mailto:bhammar.neil@gmail.com">bhammar.neil@gmail.com</a>.
        </p>

        {/* Social icons */}
        <div className="flex space-x-4 py-2">
          {/* Email - Copy to clipboard */}
          <button
            onClick={() => handleCopyEmail("bhammar.neil@gmail.com")}
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="Copy email to clipboard"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </button>

          {/* X Logo (formerly Twitter) - Corrected */}
          <a
            href="https://x.com/neilbhammar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="X (Twitter)"
          >
            {/* Proper X logo */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/neilbhammar/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/neilbhammar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="GitHub"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.304 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.287-.011-1.243-.017-2.25-3.338.724-4.043-1.607-4.043-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.089-.743.083-.728.083-.728 1.204.084 1.836 1.236 1.836 1.236 1.067 1.826 2.8 1.298 3.48.992.108-.774.418-1.298.76-1.598-2.665-.303-5.466-1.333-5.466-5.933 0-1.313.469-2.386 1.236-3.227-.124-.303-.536-1.53.117-3.187 0 0 1.008-.322 3.303 1.227.957-.266 1.986-.399 3.003-.404 1.017.005 2.046.138 3.003.404 2.295-1.549 3.303-1.227 3.303-1.227.653 1.657.241 2.884.118 3.187.77.841 1.236 1.914 1.236 3.227 0 4.608-2.805 5.623-5.475 5.92.43.372.815 1.103.815 2.222 0 1.606-.014 2.903-.014 3.295 0 .319.218.694.825.577C20.563 21.8 24 17.304 24 12c0-6.627-5.373-12-12-12z" />
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
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
            WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 100%)`,
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white opacity-30 hover:opacity-100 transition-opacity pointer-events-auto"
            onClick={() => setFlashlightActive(false)}
            aria-label="Close flashlight effect"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Toast message */}
      <div className={`copy-toast ${showToast ? "visible" : ""}`}>
        {toastMessage}
      </div>
    </main>
  );
};

export default UltraMinimal;