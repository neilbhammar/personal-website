import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/AnimatedText';
import MagneticElement from '@/components/MagneticElement';
import ParallaxSection from '@/components/ParallaxSection';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    
    // Fade in content when scrolled into view
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 20%',
          scrub: false,
          once: true,
        },
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-32 min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image or visual with parallax effect */}
          <ParallaxSection 
            intensity={0.2} 
            direction="up"
            className="rounded-2xl overflow-hidden h-[500px] relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/40 mix-blend-multiply rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center">
                <MagneticElement strength={0.3}>
                  <div className="text-4xl md:text-7xl font-bold text-white">N</div>
                </MagneticElement>
              </div>
            </div>
          </ParallaxSection>
          
          {/* Text content */}
          <div ref={contentRef} className="space-y-8">
            <AnimatedText
              as="h2"
              className="text-4xl md:text-5xl font-bold mb-6"
              delay={0.2}
              stagger={0.03}
              triggerOnce={false}
            >
              About Me
            </AnimatedText>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                I spent the last 5.5 years building and scaling BusRight as employee #1, 
                leading product development from concept to acquisition.
              </p>
              
              <p>
                Before that, I was supporting and investing in founders at DormRoomFund and 
                working with early-stage startups at Northeastern University.
              </p>
              
              <p>
                Now I'm exploring new opportunities while sharing what I've learned along the way.
                I'm passionate about product strategy, design systems, and creating delightful user experiences.
              </p>
              
              <p>
                When I'm not coding or designing, you might find me exploring new coffee shops, 
                reading about technology, or enjoying outdoor activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;