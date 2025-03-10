
import React from 'react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

const FeatureFlagControls: React.FC = () => {
  const { features, toggleAnimations, toggleTooltips, setTooltipPosition, isMobile } = useFeatureFlags();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 text-sm">
      <div className="mb-2 font-medium">Feature Controls</div>
      
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="animations-toggle"
          checked={features.enableAnimations}
          onChange={toggleAnimations}
          disabled={isMobile}
          className="mr-2"
        />
        <label htmlFor="animations-toggle" className={isMobile ? "text-gray-500" : ""}>
          Animations {isMobile && "(disabled on mobile)"}
        </label>
      </div>
      
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="tooltips-toggle"
          checked={features.enableTooltips}
          onChange={toggleTooltips}
          className="mr-2"
        />
        <label htmlFor="tooltips-toggle">Tooltips</label>
      </div>
      
      <div className="mb-2">
        <div className="mb-1">Tooltip Position:</div>
        <div className="flex space-x-2">
          {(['top', 'bottom', 'left', 'right'] as const).map(position => (
            <button
              key={position}
              onClick={() => setTooltipPosition(position)}
              className={`px-2 py-1 text-xs rounded ${
                features.tooltipPosition === position 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagControls;
