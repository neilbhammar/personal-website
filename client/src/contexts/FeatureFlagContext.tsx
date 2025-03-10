
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeatureFlags {
  tooltips: boolean;
  animations: boolean;
}

interface FeatureFlagContextType {
  flags: FeatureFlags;
  toggleFlag: (flag: keyof FeatureFlags) => void;
}

const defaultFlags: FeatureFlags = {
  tooltips: true,
  animations: true
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default values
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const savedFlags = localStorage.getItem('featureFlags');
    return savedFlags ? JSON.parse(savedFlags) : defaultFlags;
  });

  // Save to localStorage when flags change
  useEffect(() => {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (flag: keyof FeatureFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  // Disable animations on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFlags(prev => ({
          ...prev,
          animations: false
        }));
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags, toggleFlag }}>
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
