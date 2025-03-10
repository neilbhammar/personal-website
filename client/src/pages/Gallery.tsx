import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  caption: string;
  category?: string;
}

// Sample gallery data - replace with your actual images
const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    title: 'Project One',
    caption: 'A creative exploration of design',
    category: 'Design'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    title: 'Adventure',
    caption: 'Exploring new frontiers',
    category: 'Travel'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Nature',
    caption: 'The beauty of our world',
    category: 'Nature'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1516617442634-75371039cb3a',
    title: 'Technology',
    caption: 'Innovation at its best',
    category: 'Tech'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb',
    title: 'Architecture',
    caption: 'Building the future',
    category: 'Architecture'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
    title: 'Urban Life',
    caption: 'City vibes and energy',
    category: 'Urban'
  }
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  // Get unique categories for the filter
  const categoriesSet = new Set<string>();
  galleryImages.forEach(img => {
    if (img.category) categoriesSet.add(img.category);
  });
  const categories = Array.from(categoriesSet);
  
  // Filter images based on selected category
  useEffect(() => {
    if (activeFilter) {
      setFilteredImages(galleryImages.filter(img => img.category === activeFilter));
    } else {
      setFilteredImages(galleryImages);
    }
  }, [activeFilter]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <a className="text-blue-400 hover:text-blue-300 flex items-center group">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </a>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Photo Gallery</h1>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === null ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div 
              key={image.id} 
              className="relative group rounded-lg overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedImage(image)}
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
                {image.category && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-600 rounded-full">
                    {image.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Image Modal/Lightbox */}
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  className="w-full object-contain max-h-[80vh]"
                />
                <button 
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold">{selectedImage.title}</h2>
                <p className="text-gray-400 mt-1">{selectedImage.caption}</p>
                {selectedImage.category && (
                  <span className="inline-block mt-3 px-3 py-1 text-sm bg-blue-600 rounded-full">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Gallery;