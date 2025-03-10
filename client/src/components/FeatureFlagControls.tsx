
import React from 'react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

const FeatureFlagControls: React.FC = () => {
  const { flags, toggleFlag } = useFeatureFlags();
  
  return (
    <div className="feature-flag-controls">
      <h3 className="text-sm font-medium mb-2">Site Controls</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={flags.tooltips}
                onChange={() => toggleFlag('tooltips')}
              />
              <div className={`block w-10 h-6 rounded-full ${flags.tooltips ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${flags.tooltips ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm">Tooltips</div>
          </label>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={flags.animations}
                onChange={() => toggleFlag('animations')}
              />
              <div className={`block w-10 h-6 rounded-full ${flags.animations ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${flags.animations ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm">Animations</div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagControls;
