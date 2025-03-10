
import React, { useEffect, useRef, useState } from 'react';
import { Experience } from '../data/experiences';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExperienceTooltipProps {
  data: Experience;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

const ExperienceTooltip: React.FC<ExperienceTooltipProps> = ({ 
  data, 
  visible, 
  anchorRef, 
  onClose,
  position = 'top'
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = Array.isArray(data.stories) ? data.stories : [{ title: data.title, description: data.description }];
  
  // Position tooltip relative to anchor element
  useEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return;
    
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top, left;
    
    if (position === 'top') {
      // Position above the word with a small gap
      top = anchorRect.top - tooltipRect.height - 15;
      // Center horizontally
      left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
    } else {
      // Position below the word with a small gap
      top = anchorRect.bottom + 5;
      // Center horizontally
      left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
    }
    
    // Make sure tooltip stays within viewport
    const rightEdge = left + tooltipRect.width;
    const viewportWidth = window.innerWidth;
    
    if (rightEdge > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (left < 10) {
      left = 10;
    }
    
    // Apply position
    tooltipRef.current.style.top = `${top}px`;
    tooltipRef.current.style.left = `${left}px`;
    
    // Add a small arrow pointing to the word
    const tooltipCenter = left + (tooltipRect.width / 2);
    const anchorCenter = anchorRect.left + (anchorRect.width / 2);
    const arrowOffset = anchorCenter - tooltipCenter;
    
    const arrowElement = document.createElement('div');
    arrowElement.className = `tooltip-arrow tooltip-arrow-${position}`;
    arrowElement.style.transform = `translateX(${arrowOffset}px)`;
    
    // Remove any previous arrows
    const oldArrow = tooltipRef.current.querySelector('.tooltip-arrow');
    if (oldArrow) oldArrow.remove();
    
    tooltipRef.current.appendChild(arrowElement);
    
  }, [visible, anchorRef, position, currentIndex]);
  
  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : stories.length - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev < stories.length - 1 ? prev + 1 : 0));
  };
  
  if (!visible) return null;
  
  const currentStory = stories[currentIndex];
  
  return (
    <div 
      ref={tooltipRef}
      className={`experience-tooltip ${visible ? 'visible' : ''}`}
      onClick={e => e.stopPropagation()}
    >
      <div className="modern-tooltip-content">
        <div className="modern-tooltip-image-container">
          {currentStory.image && (
            <img 
              src={currentStory.image} 
              alt={currentStory.title} 
              className="modern-tooltip-image"
            />
          )}
        </div>
        <div className="modern-tooltip-text-container">
          <h3 className="modern-tooltip-title">{currentStory.title}</h3>
          <p className="modern-tooltip-description">{currentStory.description}</p>
        </div>
      </div>
      
      {stories.length > 1 && (
        <div className="modern-tooltip-navigation">
          <div className="modern-tooltip-dots">
            {stories.map((_, index) => (
              <span 
                key={index} 
                className={`modern-tooltip-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <button className="modern-tooltip-nav-button next" onClick={handleNext}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperienceTooltip;
