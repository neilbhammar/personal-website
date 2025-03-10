import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroller from '@/components/SmoothScroller';
import Spotlight from '@/components/Spotlight';
import RevealText from '@/components/RevealText';
import InteractiveCanvas from '@/components/InteractiveCanvas';
import MagneticElement from '@/components/MagneticElement';
import AdvancedCursor from '@/components/AdvancedCursor';
import AnimatedText from '@/components/AnimatedText';
import HandwritingAnimation from '@/components/HandwritingAnimation';
import ImageReveal from '@/components/ImageReveal';
import { useIsMobile } from '@/hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

const NewHome = () => {
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const workSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  
  // Set up animations on page load
  useEffect(() => {
    // Mark page as loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Clean up
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden" ref={mainRef}>
      {/* Custom cursor for desktop */}
      {!isMobile && <AdvancedCursor 
        size={12} 
        color="rgba(255, 255, 255, 0.5)" 
        mixBlendMode="difference"
        pulseOnClick={true}
        trailCount={5}
      />}

      {/* Interactive 3D background */}
      <InteractiveCanvas className="fixed inset-0" />
      
      {/* Smooth scroll wrapper */}
      <SmoothScroller options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      }}>
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 max-w-6xl mx-auto">
            <Spotlight
              color="rgba(255, 255, 255, 0.15)"
              size={300}
              intensity={0.6}
              followCursor={true}
            >
              <div className="relative z-10 my-16">
                <div className="overflow-hidden">
                  <AnimatedText 
                    as="h1" 
                    className="text-5xl md:text-7xl font-bold mb-4"
                    delay={0.3}
                  >
                    Hi, I'm Neil.
                  </AnimatedText>
                </div>
                
                <div className="h-16 md:h-24 mb-6">
                  <HandwritingAnimation 
                    text="Startup Builder & Tech Enthusiast" 
                    color="#ffffff" 
                    fontSize="1.5rem" 
                    fontFamily="'Shadows Into Light', cursive"
                    delay={1.2}
                    speed={1.5}
                  />
                </div>
                
                <div className="max-w-2xl mt-8">
                  <RevealText 
                    text="I'm a startup & tech enthusiast, bananagrams champ (at least in my house), and amateur pickleball aficionado."
                    type="word"
                    delay={1.8}
                    speed={0.03}
                    className="text-lg md:text-xl opacity-80 leading-relaxed"
                  />
                </div>

                <div className="mt-12">
                  <MagneticElement strength={0.7} className="inline-block">
                    <a href="#about" className="bg-white text-black px-8 py-3 rounded-full font-medium inline-block hover:bg-opacity-90 transition duration-300 interactive">
                      About Me
                    </a>
                  </MagneticElement>
                  
                  <MagneticElement strength={0.7} className="inline-block ml-4">
                    <a href="#work" className="border border-white px-8 py-3 rounded-full font-medium inline-block hover:bg-white hover:bg-opacity-10 transition duration-300 interactive">
                      My Work
                    </a>
                  </MagneticElement>
                </div>
              </div>
            </Spotlight>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </section>
          
          {/* About Section */}
          <section id="about" ref={aboutSectionRef} className="relative min-h-screen flex items-center px-4 md:px-12 max-w-6xl mx-auto py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <RevealText
                  text="I spent the last 5.5 years building and scaling a company"
                  type="word"
                  className="text-3xl md:text-4xl font-bold mb-6"
                  delay={0.2}
                />
                
                <div className="mb-6 overflow-hidden">
                  <MagneticElement strength={0.2}>
                    <a href="https://busright.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline interactive">
                      <AnimatedText 
                        className="text-xl md:text-2xl font-semibold"
                        delay={0.5}
                      >
                        BusRight
                      </AnimatedText>
                    </a>
                  </MagneticElement>
                </div>
                
                <RevealText
                  text="That was creating the software that powers our nation's largest mass transit system: school buses. I joined as employee #1 before we had any customers or much of a product and recently wrapped up that chapter as our Head of Operations & Customer Experience following our Series B."
                  type="word"
                  className="text-base md:text-lg opacity-80 leading-relaxed mb-6"
                  delay={0.7}
                />
                
                <RevealText
                  text="Before that, I invested in and supported founders at DormRoomFund and Northeastern University."
                  type="word"
                  className="text-base md:text-lg opacity-80 leading-relaxed"
                  delay={0.9}
                />
              </div>
              
              <div className="order-1 md:order-2 h-[300px] md:h-auto">
                <ImageReveal
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
                  alt="Workspace with laptop and coffee"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                  revealDirection="right"
                  threshold={0.3}
                />
              </div>
            </div>
          </section>
          
          {/* Work Section */}
          <section id="work" ref={workSectionRef} className="relative min-h-screen flex items-center px-4 md:px-12 max-w-6xl mx-auto py-24">
            <div className="w-full">
              <AnimatedText
                as="h2"
                className="text-4xl md:text-5xl font-bold mb-12 text-center"
                delay={0.2}
              >
                What's Next
              </AnimatedText>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white bg-opacity-5 p-8 rounded-xl backdrop-blur-sm border border-white border-opacity-10 transform transition-all duration-500 hover:scale-[1.02]">
                  <Spotlight
                    color="rgba(255, 255, 255, 0.1)"
                    size={200}
                    intensity={0.3}
                    followCursor={false}
                  >
                    <RevealText
                      text="I'm not sure what's next for me - I'm honestly a little lost, but that's part of the process. I'm a tinkerer by nature, so I might find myself posting fun projects here."
                      type="word"
                      className="text-base md:text-lg opacity-80 leading-relaxed"
                      delay={0.3}
                    />
                  </Spotlight>
                </div>
                
                <div className="bg-white bg-opacity-5 p-8 rounded-xl backdrop-blur-sm border border-white border-opacity-10 transform transition-all duration-500 hover:scale-[1.02]">
                  <Spotlight
                    color="rgba(255, 255, 255, 0.1)"
                    size={200}
                    intensity={0.3}
                    followCursor={false}
                  >
                    <RevealText
                      text="You can connect with me on socials (I'm more of a lurker) or shoot me an email at bhammar.neil@gmail.com."
                      type="word"
                      className="text-base md:text-lg opacity-80 leading-relaxed"
                      delay={0.5}
                    />
                  </Spotlight>
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact Section */}
          <section id="contact" ref={contactSectionRef} className="relative min-h-[50vh] flex items-center px-4 md:px-12 max-w-6xl mx-auto py-24">
            <div className="w-full text-center">
              <HandwritingAnimation
                text="Let's Connect"
                color="#ffffff"
                fontSize="3rem"
                fontFamily="'Permanent Marker', cursive"
                delay={0.2}
                speed={1}
              />
              
              <div className="flex justify-center space-x-6 mt-12">
                <MagneticElement strength={1} className="inline-block">
                  <a 
                    href="mailto:bhammar.neil@gmail.com" 
                    className="bg-white text-black w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition duration-300 interactive"
                    aria-label="Email"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                </MagneticElement>
                
                <MagneticElement strength={1} className="inline-block">
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white text-black w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition duration-300 interactive"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </MagneticElement>
                
                <MagneticElement strength={1} className="inline-block">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white text-black w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 transition duration-300 interactive"
                    aria-label="Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </MagneticElement>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="text-center py-8 text-white text-opacity-60 text-sm">
            <p>© {new Date().getFullYear()} Neil Bhammar. All rights reserved.</p>
            <p className="mt-2">Built with creativity and passion.</p>
          </footer>
        </main>
      </SmoothScroller>
    </div>
  );
};

export default NewHome;