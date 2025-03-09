import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MobileMenu from '@/components/MobileMenu';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/lib/useScrollReveal';

const Home: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize scroll reveal
  useScrollReveal();
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };
  
  return (
    <>
      <Header toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <main>
        <HeroSection />
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
