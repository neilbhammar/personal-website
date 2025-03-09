import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full py-4 px-6 md:px-12 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : ''
      }`}
    >
      <div className="container mx-auto flex justify-center items-center">
        <div className="text-xl font-handwriting tracking-wide text-primary">
          Neil Bhammar
        </div>
      </div>
    </header>
  );
};

export default Header;
