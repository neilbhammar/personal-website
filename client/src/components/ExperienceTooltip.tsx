
import { useState, useEffect, useRef } from 'react';

interface Experience {
  title: string;
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

const ExperienceTooltip: React.FC<ExperienceTooltipProps> = ({ 
  data, 
  visible, 
  anchorRef, 
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Position the tooltip relative to the anchor element
  useEffect(() => {
    const positionTooltip = () => {
      if (!tooltipRef.current || !anchorRef.current) return;
      
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Position below the anchor element
      const left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
      const top = anchorRect.bottom + 10;
      
      tooltipRef.current.style.left = `${Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20))}px`;
      tooltipRef.current.style.top = `${top}px`;
    };
    
    if (visible) {
      positionTooltip();
      window.addEventListener('resize', positionTooltip);
      window.addEventListener('scroll', positionTooltip);
    }
    
    return () => {
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip);
    };
  }, [visible, anchorRef, currentSlide]);
  
  // Auto-advance slides
  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % data.slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [visible, data.slides.length]);
  
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
      className={`absolute z-50 w-72 bg-white rounded-lg shadow-lg overflow-hidden transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      <div className="relative">
        <img 
          src={slide.image}
          alt={slide.title}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          ×
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{slide.title}</h3>
        <p className="text-gray-600 text-sm">{slide.description}</p>
      </div>
      
      <div className="flex justify-center pb-3">
        {data.slides.map((_, index) => (
          <button
            key={index}
            className={`mx-1 w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceTooltip;
