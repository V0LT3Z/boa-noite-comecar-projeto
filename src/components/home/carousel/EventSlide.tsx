
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface EventSlideProps {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  isActive?: boolean;
}

const EventSlide = ({ id, title, date, location, image, isActive = false }: EventSlideProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Generate a consistent fallback image based on the event id
  const fallbackImage = `https://picsum.photos/seed/event${id}/1200/600`;
  
  // Reset image error state when image prop changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [image]);
  
  const handleImageError = () => {
    console.log(`Image error for event ${id}, using fallback`);
    setImageError(true);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <div 
      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      style={{ 
        willChange: 'opacity, transform',
      }}
    >
      <div className="relative h-[420px] w-full overflow-hidden group">
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Main or fallback image */}
        <img 
          src={imageError ? fallbackImage : image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="eager"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            transition: 'transform 500ms ease-in-out',
            transform: isActive ? 'scale(1)' : 'scale(1.05)'
          }}
        />
        
        {/* Subtle overlay to enhance image visibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 mix-blend-multiply" 
        />
        <div 
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        />
        
        {/* Discrete date display with calendar icon */}
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-white/10">
            <Calendar className="h-4 w-4 text-primary-light" />
            <p className="text-sm font-medium">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSlide;
