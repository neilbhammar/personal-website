import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import copy from "clipboard-copy";
import useIsMobile from "../hooks/useIsMobile";
import { trackEvent } from '../services/analytics';

const Toast = ({ message, color = "yellow" }: { message: string; color?: "yellow" | "green" }) => (
  <div
    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
    bg-white/75 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg
    border border-gray-100/20 flex items-center gap-2"
  >
    <div className={`w-1 h-4 rounded-full ${color === "yellow" ? "bg-yellow-400/90" : "bg-green-500/90"}`}/>
    <p className="text-sm text-gray-700/90 whitespace-nowrap">{message}</p>
  </div>
);

const UltraMinimal = () => {
  const isMobile = useIsMobile();
  const [bananagramsActive, setBananagramsActive] = useState(false);
  const [bananagramsTriggered, setBananagramsTriggered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showMobileToast, setShowMobileToast] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const bananagramsRef = useRef<HTMLSpanElement>(null);
  const bananagramsHoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show toast if on mobile
  useEffect(() => {
    if (isMobile) {
      setShowMobileToast(true);
      const timer = setTimeout(() => {
        setShowMobileToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Auto-disable effects after 5 seconds
  useEffect(() => {
    if (bananagramsActive) {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }

      effectTimeoutRef.current = setTimeout(() => {
        setBananagramsActive(false);
      }, 5000);
    }

    return () => {
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, [bananagramsActive]);

  const handleCopyEmail = (email: string) => {
    copy(email).then(() => {
      setShowToast(true);
      setToastMessage("Email copied to clipboard");

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
      setBananagramsTriggered(true);
      bananagramsHoverTimerRef.current = null;

      if (bananagramsRef.current) {
        const originalText =
          bananagramsRef.current.textContent || "Bananagrams";

        const letters = originalText.split("");
        bananagramsRef.current.textContent = "";

        const letterElements: HTMLSpanElement[] = [];

        letters.forEach((letter) => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = letter;
          letterSpan.style.display = "inline-block";
          bananagramsRef.current!.appendChild(letterSpan);
          letterElements.push(letterSpan);
        });

        letters.forEach((letter, index) => {
          setTimeout(() => {
            if (!letterElements[index]) return;

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

            gsap.to(letterElements[index], {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                if (letterElements[index] && letterElements[index].parentNode) {
                  letterElements[index].parentNode.replaceChild(
                    tile,
                    letterElements[index],
                  );

                  gsap.to(tile, {
                    rotateY: 0,
                    duration: 0.4,
                    ease: "back.out(1.2)",
                  });
                }
              },
            });
          }, index * 150);
        });
      }
    }, 1000);
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
      if (bananagramsRef.current.textContent !== "Bananagrams") {
        while (bananagramsRef.current.firstChild) {
          bananagramsRef.current.removeChild(bananagramsRef.current.firstChild);
        }
        bananagramsRef.current.textContent = "Bananagrams";
      }
    }
  }, [bananagramsActive]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (bananagramsHoverTimerRef.current) {
        clearTimeout(bananagramsHoverTimerRef.current);
      }
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const linkClass = "underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 transition-colors";

  return (
    <main className="py-10 px-8 md:py-16 md:px-16 relative flex justify-center items-center min-h-screen">
      {/* Mobile Toast Notification */}
      {showMobileToast && (
        <Toast message="Heads up - some animations are disabled on mobile" color="yellow" />
      )}

      {/* Email Copy Toast */}
      {showToast && (
        <Toast message={toastMessage} color="green" />
      )}

      <div ref={contentRef} className="max-w-2xl w-full mx-auto space-y-6">
        <h1 className="text-2xl">Hi, I'm Neil.</h1>

        <p>
          I'm a founder (
          <a
            href="https://shortkit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            shortkit.dev
          </a>
          ), fmr operator (
          <a
            href="https://www.busright.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            BusRight
          </a>
          ), and I angel invest when time allows.
        </p>

        <p>
          I'm also eerily good at{" "}
          <a
            href="https://nanagrams.io"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <span
              ref={bananagramsRef}
              className="interactive-text"
              onMouseEnter={handleBananagramsHoverStart}
              onMouseLeave={handleBananagramsHoverEnd}
            >
              Bananagrams
            </span>
          </a>
          {" "}and have an unusually strong pickleball backhand (my net game
          suffers, though).
        </p>

        <p>
          <a
            href="https://www.linkedin.com/in/michael-seleman-541509122/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Michael
          </a>
          {" "}and I are working on empowering every developer with the same video
          technology that powers the most powerful platforms in the world, like TikTok.
          We think there are going to be incredibly cool (non-brainrot) things built
          on top of short-form video if the underlying technology becomes more
          accessible. You can read more about{" "}
          <a
            href="https://shortkit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            what we're building here
          </a>.
        </p>

        <p>
          Before ShortKit, I spent 6 years building and scaling BusRight. We built
          technology for the largest mass transit system in the country: school
          buses. By the time I left, we were powering transportation systems in 30+
          states and had raised $35M+ from awesome investors. I led operations
          and customer experience. I cared about our customers deeply and tried
          to build systems around that. One of our customers even{" "}
          <a
            href="https://www.ubqt.vc/p/customer-gets-tattoo-of-busright-logo"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            got a tattoo of our logo
          </a>
          , unprompted.
        </p>

        <p>
          When I can, I like to back founders who I think are a positive force for
          the world.
        </p>

        <p>
          Competitive sports (including building startups 😉), live music, and
          family bring me immense joy.
        </p>

        <p>
          Say hi — <a href="mailto:bhammar.neil@gmail.com" className={linkClass}>bhammar.neil@gmail.com</a>.
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

          {/* X (Twitter) */}
          <a
            href="https://x.com/neilbhammar"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
            aria-label="X (Twitter)"
          >
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
    </main>
  )
};

export default UltraMinimal;
