
import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  // Implement smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Clean up
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-7xl md:text-9xl font-bold mb-6 text-primary">404</h1>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-light mb-8"
        >
          Page not found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground/80 mb-10"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/">
            <a className="px-6 py-3 rounded-full border border-muted-foreground/20 bg-background hover:bg-primary/10 transition-colors duration-300 inline-block">
              Return home
            </a>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
