import React from 'react';
import HandwritingAnimation from '@/components/HandwritingAnimation';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 md:py-0">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className="mb-6 reveal active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary bg-opacity-20 text-primary font-medium text-sm">
              Welcome to my space
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold font-inter mb-8 reveal active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Hi, I'm{" "}
            </motion.span>
            <motion.span 
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Neil
            </motion.span>
          </motion.h1>
          
          <div className="reveal active">
            <HandwritingAnimation />
          </div>
          
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto reveal active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            If you want to see what I'm up to, you can find me on socials or send me an email.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 reveal active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a 
              href="#contact" 
              className="px-8 py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Get in touch
            </a>
            <a 
              href="#about" 
              className="px-8 py-3 bg-white text-foreground border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              Learn more about me
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
