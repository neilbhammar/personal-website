import { useEffect } from 'react';
import NewHeroSection from '@/components/sections/NewHeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CustomCursor from '@/components/CustomCursor';
import { initSmoothScroll } from '@/lib/smoothScroll';

const NewHome = () => {
  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = initSmoothScroll();
    
    return () => {
      // Cleanup
      if (typeof lenis.destroy === 'function') {
        lenis.destroy();
      }
    };
  }, []);
  
  return (
    <>
      {/* Custom cursor follows mouse */}
      <CustomCursor />
      
      {/* Main content */}
      <main className="min-h-screen w-full bg-white text-foreground font-inter">
        <NewHeroSection />
        <AboutSection />
      </main>
    </>
  );
};

export default NewHome;