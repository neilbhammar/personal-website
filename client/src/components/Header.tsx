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
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold font-inter tracking-tight">
          <span className="text-foreground">Neil</span>
          <span className="text-primary">Bhammar</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            Home
          </a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            About
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">
            Contact
          </a>
        </nav>
        
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Open mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
