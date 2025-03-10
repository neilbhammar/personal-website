import { useState, useRef, useEffect } from 'react';
import { Experience } from '@/types';

export const useEnhancedTooltip = () => {
  // Hook implementation
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  return {
    tooltipVisible,
    setTooltipVisible,
    activeExperience,
    setActiveExperience
  };
};