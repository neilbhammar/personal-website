
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import HandwritingAnimation from "@/components/HandwritingAnimation";

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  // Implement smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Subtle float animation for content
    if (contentRef.current) {
      const animation = contentRef.current.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-15px)' },
          { transform: 'translateY(0px)' },
        ],
        {
          duration: 5000,
          iterations: Infinity,
          easing: 'ease-in-out'
        }
      );
      
      return () => {
        animation.cancel();
        document.documentElement.style.scrollBehavior = "";
      };
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-6 py-20 md:py-0 font-rubik">
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl"
      >
        <div className="mb-6">
          <HandwritingAnimation 
            text="404" 
            fontSize="120px"
            fontFamily="'Caveat', cursive"
            color="hsl(181, 56%, 46%)"
            strokeWidth={2}
            delay={300}
            speed={3}
            autoPlay={true}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-xl md:text-2xl tracking-tight font-light">
            Oops, this page is missing.
          </p>
          
          <p className="text-muted-foreground/80 text-md mb-10 max-w-md mx-auto">
            When I'm not coding or designing, you might find me exploring new coffee shops, 
            but you won't find the page you're looking for here.
          </p>
          
          <div className="mt-8">
            <Link href="/">
              <a className="interactive social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7"/>
                  <path d="M19 12H5"/>
                </svg>
              </a>
              <span className="block mt-3 text-sm font-light">
                <span className="highlight-word">Go home</span>
              </span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
