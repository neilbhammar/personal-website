import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'wouter';

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

// Mock gallery images - you can replace these with your actual images
const galleryImages: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    title: 'Project One',
    caption: 'A creative exploration of design'
  },
  {
    src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    title: 'Adventure',
    caption: 'Exploring new frontiers'
  },
  {
    src: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Nature',
    caption: 'The beauty of our world'
  },
  {
    src: 'https://images.unsplash.com/photo-1516617442634-75371039cb3a',
    title: 'Technology',
    caption: 'Innovation at its best'
  },
  {
    src: 'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb',
    title: 'Architecture',
    caption: 'Building the future'
  },
  {
    src: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    title: 'Urban Life',
    caption: 'City vibes and energy'
  }
];

export function PagePeel({
  size = 150,
  cornerRadius = 20,
  shadowOpacity = 0.5,
  targetRoute = '/gallery'
}: PagePeelProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullyPeeled, setIsFullyPeeled] = useState(false);
  const [revealGallery, setRevealGallery] = useState(false);
  
  const cornerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for interactive peel effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform the rotation based on mouse position
  const rotateX = useTransform(y, [0, size], [0, 80]);
  const rotateY = useTransform(x, [0, size], [-80, 0]);
  
  // Spring physics for smooth transitions
  const springX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 20 });
  
  // Shadow and peel values
  const shadowBlur = useTransform(
    x, 
    [0, size], 
    [5, 25]
  );
  
  const pageCurl = useTransform(
    x,
    [0, size], 
    [0, 1]
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
    setIsHovered(true);
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
    
    x.set(deltaX);
    y.set(deltaY);
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset or navigate based on how far we've peeled
    if (isFullyPeeled) {
      // Keep showing the gallery
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
    if (!isFullyPeeled) {
      x.set(20); // Slightly peel on hover
      y.set(20);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isFullyPeeled) {
      x.set(0);
      y.set(0);
    }
  };
  
  return (
    <>
      <div 
        ref={containerRef}
        className="fixed top-0 right-0 z-50 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* The visual corner peel effect */}
        <motion.div
          ref={cornerRef}
          className="absolute top-0 right-0 cursor-pointer select-none"
          style={{
            width: size,
            height: size,
            perspective: 1000,
            zIndex: 101,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
        >
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{
              rotateX: springX,
              rotateY: springY,
              transformOrigin: "top right",
              backgroundImage: "linear-gradient(135deg, #f5f5f5, #e5e5e5)",
              borderRadius: `0 0 0 ${cornerRadius}px`,
              boxShadow: useTransform(
                shadowBlur,
                blur => `0 ${blur/2}px ${blur}px rgba(0,0,0,${shadowOpacity})`
              ),
              zIndex: 101
            }}
          >
            <div className="transform -rotate-45 text-gray-400 font-medium">
              <span style={{ fontSize: size * 0.1 }}>Photo Gallery</span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* The page curl shadow effect */}
        <motion.div
          className="absolute top-0 right-0"
          style={{
            width: useTransform(x, [0, size], [0, size]),
            height: useTransform(y, [0, size], [0, size]),
            background: "linear-gradient(135deg, transparent, rgba(0,0,0,0.2))",
            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            zIndex: 100,
            opacity: useTransform(pageCurl, [0, 1], [0, 0.7]),
          }}
        />
      </div>
      
      {/* Photo Gallery that appears when page is peeled */}
      <motion.div 
        className="fixed inset-0 bg-black/90 flex flex-col z-40"
        initial={{ opacity: 0, visibility: "hidden" }}
        animate={{ 
          opacity: revealGallery ? 1 : 0,
          visibility: revealGallery ? "visible" : "hidden" 
        }}
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
                animate={{ 
                  opacity: revealGallery ? 1 : 0,
                  y: revealGallery ? 0 : 20 
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 + index * 0.1
                }}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-bold">{image.title}</h3>
                  <p className="text-gray-300">{image.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default PagePeel;