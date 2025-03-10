
import { useState, useRef, useEffect } from 'react';
import { Experience } from '@/components/ExperienceTooltip';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

export const useEnhancedTooltip = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const { features, isMobile } = useFeatureFlags();
  
  // Close tooltip when clicking outside
  useEffect(() => {
    if (!features.enableTooltips) return;
    
    const handleClickOutside = () => {
      setActiveTooltip(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [features.enableTooltips]);
  
  const showTooltip = (
    event: React.MouseEvent<HTMLElement>, 
    tooltipId: string
  ) => {
    if (!features.enableTooltips || isMobile) return;
    
    event.preventDefault();
    event.stopPropagation();
    anchorRef.current = event.currentTarget;
    setActiveTooltip(tooltipId);
  };
  
  const hideTooltip = () => {
    setActiveTooltip(null);
  };
  
  const createTooltipTrigger = (tooltipId: string, content: JSX.Element) => {
    if (!features.enableTooltips && isMobile) {
      return content;
    }
    
    return (
      <span
        onClick={(e) => showTooltip(e, tooltipId)}
        className="tooltip-trigger cursor-pointer relative"
      >
        {content}
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 transition-transform hover:scale-x-100"></span>
      </span>
    );
  };
  
  return {
    activeTooltip,
    anchorRef,
    showTooltip,
    hideTooltip,
    createTooltipTrigger,
    tooltipPosition: features.tooltipPosition
  };
};
