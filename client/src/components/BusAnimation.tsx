import React, { useState, useEffect } from 'react';

interface BusAnimationProps {
  isActive: boolean;
}

const BusAnimation: React.FC<BusAnimationProps> = ({ isActive }) => {
  return (
    <div className={`bus-animation-container ${isActive ? 'active' : ''}`}>
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bus body */}
        <rect x="10" y="15" width="100" height="30" rx="5" fill="#FFC107" />
        <rect x="5" y="15" width="5" height="30" fill="#FFC107" />
        <rect x="110" y="15" width="5" height="30" rx="2" fill="#FFC107" />
        
        {/* Windows */}
        <rect x="20" y="20" width="12" height="10" rx="2" fill="#E0F7FA" />
        <rect x="40" y="20" width="12" height="10" rx="2" fill="#E0F7FA" />
        <rect x="60" y="20" width="12" height="10" rx="2" fill="#E0F7FA" />
        <rect x="80" y="20" width="12" height="10" rx="2" fill="#E0F7FA" />
        <rect x="95" y="22" width="10" height="15" rx="2" fill="#E0F7FA" />
        
        {/* Windshield */}
        <path d="M5 15H15V35C15 37.7614 12.7614 40 10 40V40C7.23858 40 5 37.7614 5 35V15Z" fill="#E0F7FA" />
        
        {/* Wheels */}
        <circle cx="30" cy="45" r="8" fill="#333333" />
        <circle cx="30" cy="45" r="4" fill="#666666" />
        <circle cx="90" cy="45" r="8" fill="#333333" />
        <circle cx="90" cy="45" r="4" fill="#666666" />
        
        {/* Details */}
        <rect x="10" y="10" width="100" height="5" rx="2" fill="#E65100" />
        <rect x="40" y="35" width="40" height="5" rx="2" fill="#333333" />
        
        {/* Lights */}
        <rect x="110" y="20" width="5" height="5" rx="1" fill="#FFEB3B" />
        <rect x="110" y="30" width="5" height="5" rx="1" fill="#F44336" />
        <rect x="5" y="20" width="5" height="5" rx="1" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export default BusAnimation;