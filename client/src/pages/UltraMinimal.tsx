import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import copy from 'clipboard-copy';
import ExperienceTooltip from '../components/ExperienceTooltip';
import { experiences } from '../data/experiences';
import React from 'react';
import CanvasAnimation from '@/components/CanvasAnimation';
import { useEnhancedTooltip } from '@/hooks/use-enhanced-tooltip';
import { Experience } from '@/types';


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

  // Sample experiences data (merged with original data structure)

  const experiencesData: Record<string, Experience> = {
    busright: {
      title: "BusRight",
      company: "Co-founder & CTO",
      period: "2018 - 2021",
      description: "Led development of bus tracking platform used by schools across the US",
      image: "/images/busright.jpg",
      items: [
        {
          title: "Early Days",
          description: "Started with a simple MVP to track school buses in real-time",
          image: "/images/busright-early.jpg"
        },
        {
          title: "Scaling Up",
          description: "Grew to track thousands of buses daily across multiple school districts",
          image: "/images/busright-scaling.jpg"
        }
      ]
    },
    dormRoomFund: {
      title: "Dorm Room Fund",
      company: "Investment Partner",
      period: "2019 - 2020",
      description: "Evaluated startups and made investment decisions as part of student-run VC fund",
      image: "/images/drf.jpg"
    },
    northeastern: {
      title: "Northeastern University",
      company: "Computer Science + Design",
      period: "2017 - 2021",
      description: "Studied CS and Design, focusing on HCI and product development",
      image: "/images/northeastern.jpg"
    }
  };


  // Handle click outside to close tooltip
  useEffect(() => {
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
          I'm a software engineer with experience in web development, mobile apps, and design.
        </p>

        <p>
          Previously, I co-founded{" "}
          <a 
            ref={busrightRef}
            href="#" 
            className="interactive-text"
            onClick={(e) => {
              e.preventDefault();
              setActiveExperience('busright');
              setTooltipVisible(true);
            }}
          >
            BusRight
          </a>, 
          invested with{" "}
          <a 
            ref={dormRoomFundRef}
            href="#" 
            className="interactive-text"
            onClick={(e) => {
              e.preventDefault();
              setActiveExperience('dormRoomFund');
              setTooltipVisible(true);
            }}
          >
            Dorm Room Fund
          </a>, 
          and studied at{" "}
          <a 
            ref={northeasternRef}
            href="#" 
            className="interactive-text"
            onClick={(e) => {
              e.preventDefault();
              setActiveExperience('northeastern');
              setTooltipVisible(true);
            }}
          >
            Northeastern University
          </a>.
        </p>
      </div>

      {/* Experience tooltips */}
      {activeExperience && (
        <ExperienceTooltip
          data={experiencesData[activeExperience]}
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