import React from 'react';
import HandwritingAnimation from '@/components/HandwritingAnimation';
import { motion } from 'framer-motion';
import { FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import copy from 'clipboard-copy';

const HeroSection: React.FC = () => {
  const { toast } = useToast();

  const handleCopyEmail = () => {
    copy('bhammar.neil@gmail.com').then(() => {
      toast({
        title: "Email copied!",
        description: "bhammar.neil@gmail.com copied to clipboard",
      });
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 md:py-0">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col">
          <div className="reveal active mb-8">
            <HandwritingAnimation />
          </div>
          
          <motion.div 
            className="flex items-center justify-center gap-8 mt-12 reveal active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a 
              href="https://twitter.com/neilbhammar" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
              aria-label="Twitter profile"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/in/neilbhammar" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
              aria-label="LinkedIn profile"
            >
              <FaLinkedinIn className="h-5 w-5" />
            </a>
            <button 
              onClick={handleCopyEmail}
              className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
              aria-label="Copy email address"
            >
              <Mail className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
