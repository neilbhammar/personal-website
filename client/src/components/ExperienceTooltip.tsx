
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Experience {
  title: string;
  company?: string;
  period?: string;
  description: string;
  image?: string;
  items?: { title: string; description: string; image?: string }[];
}

interface ExperienceTooltipProps {
  data: Experience;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const ExperienceTooltip: React.FC<ExperienceTooltipProps> = ({
  data,
  visible,
  anchorRef,
  onClose,
  position = 'top',
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  const items = data.items || [{ title: data.title, description: data.description, image: data.image }];
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentItem((prev) => (prev + 1) % items.length);
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentItem((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (visible && anchorRef.current && tooltipRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      // Position based on specified option
      switch (position) {
        case 'top':
          top = anchorRect.top - tooltipRect.height - 10;
          left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = anchorRect.bottom + 10;
          left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = anchorRect.top + (anchorRect.height / 2) - (tooltipRect.height / 2);
          left = anchorRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = anchorRect.top + (anchorRect.height / 2) - (tooltipRect.height / 2);
          left = anchorRect.right + 10;
          break;
      }
      
      // Keep tooltip within viewport
      const rightEdge = left + tooltipRect.width;
      const bottomEdge = top + tooltipRect.height;
      
      if (rightEdge > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      if (left < 10) {
        left = 10;
      }
      
      if (bottomEdge > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      if (top < 10) {
        top = 10;
      }
      
      setTooltipPosition({ top, left });
    }
  }, [visible, anchorRef, position, currentItem]);

  if (!visible) return null;

  const currentContent = items[currentItem];

  return (
    <div 
      ref={tooltipRef}
      className={`experience-tooltip ${visible ? 'visible' : ''}`}
      style={{ 
        position: 'fixed', 
        top: `${tooltipPosition.top}px`, 
        left: `${tooltipPosition.left}px`,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="tooltip-content-container">
        <div className="tooltip-image-text-container">
          {currentContent.image && (
            <div className="tooltip-image-container">
              <img 
                src={currentContent.image} 
                alt={currentContent.title} 
                className="tooltip-image"
              />
            </div>
          )}
          <div className="tooltip-text-container">
            <h3 className="tooltip-title">{currentContent.title}</h3>
            {data.company && <p className="tooltip-company">{data.company}</p>}
            {data.period && <p className="tooltip-period">{data.period}</p>}
            <p className="tooltip-description">{currentContent.description}</p>
          </div>
        </div>
        
        {items.length > 1 && (
          <>
            <div className="tooltip-indicator">
              {items.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`tooltip-dot ${idx === currentItem ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <div className="tooltip-navigation">
              <button 
                className="tooltip-nav-button prev" 
                onClick={handlePrev}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <button 
                className="tooltip-nav-button next" 
                onClick={handleNext}
                aria-label="Next"  
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperienceTooltip;
