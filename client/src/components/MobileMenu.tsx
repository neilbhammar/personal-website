import React from 'react';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const handleNavLinkClick = () => {
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 bg-foreground bg-opacity-95 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-end p-6">
        <button 
          className="text-white focus:outline-none" 
          onClick={onClose}
          aria-label="Close mobile menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex flex-col items-center justify-center h-full space-y-8">
        <a 
          href="#home" 
          className="text-white text-2xl hover:text-primary transition-colors duration-300"
          onClick={handleNavLinkClick}
        >
          Home
        </a>
        <a 
          href="#about" 
          className="text-white text-2xl hover:text-primary transition-colors duration-300"
          onClick={handleNavLinkClick}
        >
          About
        </a>
        <a 
          href="#contact" 
          className="text-white text-2xl hover:text-primary transition-colors duration-300"
          onClick={handleNavLinkClick}
        >
          Contact
        </a>
      </nav>
    </div>
  );
};

export default MobileMenu;
