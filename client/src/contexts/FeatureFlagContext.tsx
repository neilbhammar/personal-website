
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FeatureFlags {
  enableAnimations: boolean;
  enableTooltips: boolean;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
}

interface FeatureFlagContextType {
  features: FeatureFlags;
  toggleAnimations: () => void;
  toggleTooltips: () => void;
  setTooltipPosition: (position: 'top' | 'bottom' | 'left' | 'right') => void;
  isMobile: boolean;
}

const defaultFeatures: FeatureFlags = {
  enableAnimations: true,
  enableTooltips: true,
  tooltipPosition: 'top'
};

export const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureFlags>(defaultFeatures);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-disable animations on mobile
      if (mobile) {
        setFeatures(prev => ({
          ...prev,
          enableAnimations: false
        }));
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleAnimations = () => {
    setFeatures(prev => ({
      ...prev,
      enableAnimations: !prev.enableAnimations
    }));
  };

  const toggleTooltips = () => {
    setFeatures(prev => ({
      ...prev,
      enableTooltips: !prev.enableTooltips
    }));
  };

  const setTooltipPosition = (position: 'top' | 'bottom' | 'left' | 'right') => {
    setFeatures(prev => ({
      ...prev,
      tooltipPosition: position
    }));
  };

  return (
    <FeatureFlagContext.Provider 
      value={{ 
        features, 
        toggleAnimations, 
        toggleTooltips, 
        setTooltipPosition, 
        isMobile 
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
