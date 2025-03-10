
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ExperienceSlide {
  title: string;
  description: string;
  image: string;
}

interface Experience {
  name: string;
  slides: ExperienceSlide[];
}

interface ExperienceTooltipProps {
  data: Experience;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

const ExperienceTooltip = ({ data, visible, anchorRef, onClose }: ExperienceTooltipProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position the tooltip relative to the anchor element
  useEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;

    // Position below the anchor
    const top = anchorRect.bottom + scrollY + 10;
    let left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);

    // Ensure the tooltip doesn't go off-screen
    const viewportWidth = window.innerWidth;
    if (left < 20) left = 20;
    if (left + tooltipRect.width > viewportWidth - 20) {
      left = viewportWidth - tooltipRect.width - 20;
    }

    tooltipRef.current.style.top = `${top}px`;
    tooltipRef.current.style.left = `${left}px`;
  }, [visible, anchorRef, currentSlide]);

  useEffect(() => {
    if (!visible) setCurrentSlide(0);
  }, [visible]);

  // Navigate between slides
  const goToNextSlide = () => {
    if (currentSlide < data.slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Handle clicks outside the tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);
  
  if (!visible) return null;
  
  const slide = data.slides[currentSlide];
  
  return (
    <div 
      ref={tooltipRef}
      className={`experience-tooltip ${visible ? 'visible' : ''}`}
    >
      <div className="tooltip-header">
        <div className="tooltip-image-container">
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="tooltip-image"
          />
        </div>
        <div className="tooltip-title-container">
          <h3 className="tooltip-title">{slide.title}</h3>
          <p className="tooltip-subtitle">{data.name}</p>
        </div>
      </div>
      
      <div className="tooltip-content">
        <p className="tooltip-description">{slide.description}</p>
      </div>
      
      {data.slides.length > 1 && (
        <>
          <div className="tooltip-indicator">
            {data.slides.map((_, index) => (
              <span
                key={index}
                className={`tooltip-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          <div className="tooltip-navigation">
            <button
              className={`tooltip-nav-button prev ${currentSlide === 0 ? 'disabled' : ''}`}
              onClick={goToPrevSlide}
              disabled={currentSlide === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button
              className={`tooltip-nav-button next ${currentSlide === data.slides.length - 1 ? 'disabled' : ''}`}
              onClick={goToNextSlide}
              disabled={currentSlide === data.slides.length - 1}
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperienceTooltip;
