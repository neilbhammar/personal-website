// This is the 404 page shown when a user visits a URL that doesn't exist
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion"; // Used for animations

export default function NotFound() {
  // Enable smooth scrolling when this page loads
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Clean up when leaving the page
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-6 py-20 md:py-0 font-rubik">
      {/* Animated container that fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl"
      >
        {/* Large 404 heading */}
        <h1 className="text-7xl md:text-9xl font-bold mb-8">404 Error</h1>
        
        {/* Content that fades in with a delay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Clever startup-themed error message */}
          <p className="text-muted-foreground/80 text-md mb-10 max-w-md mx-auto leading-relaxed">
            A lot of building a winning startup is about having finding and betting on something early. 
            In this case you are a little too early because this page does not exist yet.
          </p>
          
          {/* Home page link */}
          <div className="mt-8">
            <Link href="/">
              <a className="px-6 py-3 rounded-md border border-foreground/10 hover:bg-foreground/5 transition-colors duration-300 inline-block">
                Return home
              </a>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
