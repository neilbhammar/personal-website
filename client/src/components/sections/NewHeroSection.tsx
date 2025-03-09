import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AnimatedText from '@/components/AnimatedText';
import MagneticElement from '@/components/MagneticElement';
import { ThreeScene } from '@/lib/3d/threeSetup';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';

const NewHeroSection = () => {
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const [threeScene, setThreeScene] = useState<ThreeScene | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [showAmbient, setShowAmbient] = useState(false);
  
  // Setup Three.js scene on mount
  useEffect(() => {
    if (!threeContainerRef.current) return;
    
    const scene = new ThreeScene('three-container');
    setThreeScene(scene);
    
    // Cleanup on unmount
    return () => {
      scene.dispose();
    };
  }, []);
  
  // Handle ambient particles activation
  useEffect(() => {
    if (!threeScene) return;
    
    if (showAmbient) {
      threeScene.activate();
    } else {
      threeScene.deactivate();
    }
  }, [showAmbient, threeScene]);
  
  // Initial animations
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    
    const section = sectionRef.current;
    const content = contentRef.current;
    
    // Initial fade-in
    gsap.fromTo(
      section,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );
    
    // Subtle float animation
    gsap.to(content, {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    
    // Automatically show ambient particles after delay
    const timer = setTimeout(() => {
      setShowAmbient(true);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  const handleFirstLineComplete = () => {
    // Trigger something after first text animation completes
    console.log('First line animation complete');
  };
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-20 px-4"
    >
      {/* Three.js ambient particles container */}
      <div 
        id="three-container" 
        ref={threeContainerRef}
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Content container */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <AnimatedText
              as="h1"
              className="text-5xl md:text-7xl font-bold mb-6"
              delay={0.5}
              duration={0.7}
              stagger={0.03}
              onComplete={handleFirstLineComplete}
            >
              Hi, I'm Neil
            </AnimatedText>
            
            <AnimatedText
              as="p"
              className="text-xl md:text-2xl text-muted-foreground mb-8"
              delay={1.8}
              duration={0.5}
              stagger={0.02}
            >
              Still a work in progress
            </AnimatedText>
            
            <AnimatedText
              as="p"
              className="text-lg md:text-xl text-muted-foreground/80 mb-12"
              delay={3}
              duration={0.4}
              stagger={0.015}
            >
              (both me and the website, I guess!)
            </AnimatedText>
          </div>
          
          {/* Social links */}
          <div className="flex items-center space-x-6 mt-10 opacity-0 animate-fade-in" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
            <MagneticElement strength={0.7}>
              <a href="https://github.com/neilbhamra" className="interactive p-2 rounded-full border border-muted-foreground/20 bg-background hover:bg-primary/10 transition-colors duration-300" aria-label="GitHub">
                <FiGithub className="w-5 h-5" />
              </a>
            </MagneticElement>
            
            <MagneticElement strength={0.7}>
              <a href="https://linkedin.com/in/neilbhamra" className="interactive p-2 rounded-full border border-muted-foreground/20 bg-background hover:bg-primary/10 transition-colors duration-300" aria-label="LinkedIn">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </MagneticElement>
            
            <MagneticElement strength={0.7}>
              <a href="https://twitter.com/neilbhamra" className="interactive p-2 rounded-full border border-muted-foreground/20 bg-background hover:bg-primary/10 transition-colors duration-300" aria-label="Twitter">
                <FiTwitter className="w-5 h-5" />
              </a>
            </MagneticElement>
            
            <MagneticElement strength={0.7}>
              <a href="mailto:hello@neilbhamra.com" className="interactive p-2 rounded-full border border-muted-foreground/20 bg-background hover:bg-primary/10 transition-colors duration-300" aria-label="Email">
                <FiMail className="w-5 h-5" />
              </a>
            </MagneticElement>
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 opacity-0 animate-fade-in" style={{ animationDelay: '4s', animationFillMode: 'forwards' }}>
            <MagneticElement strength={0.5}>
              <Button variant="outline" size="lg" className="interactive group">
                <span>More about me</span>
                <FiArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </MagneticElement>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;