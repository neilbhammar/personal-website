import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';

interface PagePeelProps {
  size?: number;
  cornerRadius?: number;
  shadowOpacity?: number;
  targetRoute?: string;
}

interface GalleryImage {
  src: string;
  title: string;
  caption: string;
}

// Gallery images - replace with actual images as needed
const galleryImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    title: 'Project One',
    caption: 'A creative exploration of design'
  },
  {
    src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1498&q=80',
    title: 'Adventure',
    caption: 'Exploring new frontiers'
  },
  {
    src: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    title: 'Nature',
    caption: 'The beauty of our world'
  },
  {
    src: 'https://images.unsplash.com/photo-1516617442634-75371039cb3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80',
    title: 'Technology',
    caption: 'Innovation at its best'
  },
  {
    src: 'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    title: 'Architecture',
    caption: 'Building the future'
  },
  {
    src: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    title: 'Urban Life',
    caption: 'City vibes and energy'
  }
];

export function PagePeel({
  size = 120,
  cornerRadius = 15,
  shadowOpacity = 0.5,
  targetRoute = '/gallery'
}: PagePeelProps) {
  const [location, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFullyPeeled, setIsFullyPeeled] = useState(false);
  const [revealGallery, setRevealGallery] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const cornerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for interactive peel effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform the rotation based on mouse position
  const rotateX = useTransform(y, [0, size], [0, 45]);
  const rotateY = useTransform(x, [0, size], [-45, 0]);
  
  // Spring physics for smooth transitions
  const springX = useSpring(rotateX, { stiffness: 300, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 25 });
  
  // Shadow and page curl values
  const shadowBlur = useTransform(
    x, 
    [0, size], 
    [5, 20]
  );
  
  const pageCurl = useTransform(
    x,
    [0, size], 
    [0, 1]
  );
  
  // Visual indicator for how far to pull
  const peelProgress = useTransform(
    x,
    [0, size * 0.7], 
    [0, 100]
  );
  
  // Track if we've fully peeled (for navigation)
  useEffect(() => {
    const unsubscribeX = x.onChange(value => {
      if (value > size * 0.7) {
        setIsFullyPeeled(true);
      } else {
        setIsFullyPeeled(false);
      }
      
      // Reveal gallery at a certain threshold
      if (value > size * 0.5) {
        setRevealGallery(true);
      } else {
        setRevealGallery(false);
      }
    });
    
    return () => {
      unsubscribeX();
    };
  }, [x, size]);
  
  // Handle mouse interaction with the corner
  const handleMouseDown = () => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!cornerRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const cornerRight = containerRect.right;
    const cornerTop = containerRect.top;
    
    // Calculate distance from corner (top right)
    const deltaX = Math.max(0, Math.min(size, cornerRight - e.clientX));
    const deltaY = Math.max(0, Math.min(size, e.clientY - cornerTop));
    
    // Set with a slight delay for more natural feel
    x.set(deltaX);
    y.set(deltaY);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset or navigate based on how far we've peeled
    if (isFullyPeeled) {
      // Keep gallery open or navigate
      if (targetRoute && !revealGallery) {
        setLocation(targetRoute);
      }
    } else {
      // Spring back to original position
      x.set(0);
      y.set(0);
      setRevealGallery(false);
    }
  };
  
  // Handle hover interactions
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isFullyPeeled && !isDragging) {
      x.set(15); // Slightly peel on hover
      y.set(15);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFullyPeeled && !isDragging) {
      x.set(0);
      y.set(0);
    }
  };
  
  return (
    <>
      <div 
        ref={containerRef}
        className="fixed top-0 right-0 z-50 overflow-hidden pointer-events-none"
        style={{ width: size, height: size }}
      >
        {/* The visual corner peel effect */}
        <motion.div
          ref={cornerRef}
          className="absolute top-0 right-0 cursor-pointer select-none page-peel-corner pointer-events-auto"
          style={{
            width: size,
            height: size,
            perspective: 1500,
            zIndex: 101,
            border: "1px dashed rgba(0,0,0,0.2)",
            borderTop: "none",
            borderRight: "none",
            borderRadius: "0 0 0 10px"
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          animate={{ 
            scale: isHovered && !isDragging ? 1.05 : 1
          }}
          transition={{ 
            scale: { duration: 0.2 } 
          }}
        >
          <motion.div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              rotateX: springX,
              rotateY: springY,
              transformOrigin: "top right",
              backgroundImage: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
              borderRadius: `0 0 0 ${cornerRadius}px`,
              boxShadow: useTransform(
                shadowBlur,
                blur => `0 ${blur/2}px ${blur}px rgba(0,0,0,${shadowOpacity})`
              ),
              zIndex: 101,
              border: "1px solid rgba(0,0,0,0.1)",
              borderTop: "none",
              borderRight: "none"
            }}
          >
            <div 
              className="transform -rotate-45 text-gray-600 font-medium flex items-center justify-center"
              style={{ 
                fontSize: size * 0.1,
                width: '100%',
                height: '100%',
                padding: 4
              }}
            >
              <div className="relative">
                <span className="text-lg font-bold">Photo Gallery</span>
                <div className="absolute -top-4 -right-10 text-xs text-gray-500 font-normal">
                  <span>⟵ Pull</span>
                </div>
                {!isFullyPeeled && (
                  <motion.div
                    className="absolute -bottom-2 left-0 h-2 bg-blue-500 rounded-full"
                    style={{ 
                      width: peelProgress.get() + '%',
                      opacity: useTransform(pageCurl, [0, 0.3, 1], [0, 1, 1])
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* The page curl shadow effect */}
        <motion.div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: useTransform(x, [0, size], [0, size]),
            height: useTransform(y, [0, size], [0, size]),
            background: "linear-gradient(135deg, transparent, rgba(0,0,0,0.2))",
            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            zIndex: 100,
            opacity: useTransform(pageCurl, [0, 0.1, 1], [0, 0.3, 0.7]),
          }}
        />
      </div>
      
      {/* Photo Gallery that appears when page is peeled */}
      <AnimatePresence>
        {revealGallery && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex flex-col z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto p-8 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-3xl font-bold">Photo Gallery</h2>
                <button 
                  className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setIsFullyPeeled(false);
                    setRevealGallery(false);
                    x.set(0);
                    y.set(0);
                  }}
                >
                  Close Gallery
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => (
                  <motion.div 
                    key={index} 
                    className="relative group rounded-lg overflow-hidden bg-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.1 + index * 0.1
                    }}
                  >
                    <div className="aspect-w-3 aspect-h-2">
                      <img 
                        src={image.src} 
                        alt={image.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transform translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-bold">{image.title}</h3>
                      <p className="text-gray-300">{image.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PagePeel;