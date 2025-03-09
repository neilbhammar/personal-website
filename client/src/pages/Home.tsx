import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/lib/useScrollReveal';

const Home: React.FC = () => {
  // Initialize scroll reveal
  useScrollReveal();
  
  return (
    <>
      <Header toggleMobileMenu={() => {}} />
      
      <main>
        <HeroSection />
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
