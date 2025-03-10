import { useState, useEffect, useRef } from 'react';

interface Experience {
  title: string;
  location?: string;
  year?: string;
  slides: {
    image: string;
    title: string;
    description: string;
  }[];
}

interface ExperienceTooltipProps {
  data: Experience;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

export default function ExperienceTooltip({ data, visible, anchorRef, onClose }: ExperienceTooltipProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Handle position of the tooltip relative to the anchor element
  useEffect(() => {
    if (!visible || !tooltipRef.current || !anchorRef.current) return;
    
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    
    // Position the tooltip centered below the anchor
    tooltipEl.style.left = `${anchorRect.left + (anchorRect.width / 2) - (tooltipEl.offsetWidth / 2)}px`;
    tooltipEl.style.top = `${anchorRect.bottom + window.scrollY + 8}px`;
    
    // Ensure the tooltip doesn't go off-screen
    const tooltipRect = tooltipEl.getBoundingClientRect();
    
    // Adjust horizontal positioning if needed
    if (tooltipRect.left < 16) {
      tooltipEl.style.left = '16px';
    } else if (tooltipRect.right > window.innerWidth - 16) {
      tooltipEl.style.left = `${window.innerWidth - tooltipEl.offsetWidth - 16}px`;
    }
  }, [visible, anchorRef]);
  
  // Close tooltip when clicking outside
  useEffect(() => {
    if (!visible) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);
  
  // Navigate between slides
  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % data.slides.length);
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + data.slides.length) % data.slides.length);
  };
  
  if (!data || !visible) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className={`experience-tooltip ${visible ? 'visible' : ''}`}
    >
      <div className="tooltip-header">
        <div className="tooltip-image-container">
          <img 
            src={data.slides[currentSlide].image} 
            alt={data.slides[currentSlide].title}
            className="tooltip-image"
          />
        </div>
        <div className="tooltip-title-container">
          <h4 className="tooltip-title">{data.title}</h4>
          {data.location && <p className="tooltip-subtitle">{data.location}</p>}
          {data.year && <p className="tooltip-subtitle">{data.year}</p>}
        </div>
      </div>
      
      <div className="tooltip-content">
        <h5 className="tooltip-title">{data.slides[currentSlide].title}</h5>
        <p className="tooltip-description">{data.slides[currentSlide].description}</p>
      </div>
      
      {data.slides.length > 1 && (
        <>
          <div className="tooltip-indicator">
            {data.slides.map((_, index) => (
              <div 
                key={index} 
                className={`tooltip-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          <div className="tooltip-navigation">
            <button 
              className="tooltip-nav-button prev"
              onClick={goToPrevSlide}
              aria-label="Previous slide"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>
            
            <button 
              className="tooltip-nav-button next"
              onClick={goToNextSlide}
              aria-label="Next slide"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}