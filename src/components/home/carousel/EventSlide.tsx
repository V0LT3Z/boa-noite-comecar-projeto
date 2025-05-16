
import React from 'react';
import { Link } from 'react-router-dom';

interface EventSlideProps {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  isActive?: boolean;
}

const EventSlide = ({ id, title, date, location, image, isActive = false }: EventSlideProps) => {
  return (
    <div 
      className={`relative group h-[420px] ${isActive ? 'opacity-100' : 'opacity-0'} absolute inset-0 transition-opacity duration-300`}
      style={{ willChange: 'opacity, transform' }}
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
        <span className="inline-block px-4 py-1 bg-primary/80 text-white text-sm rounded-full mb-4">
          Em destaque
        </span>
        <h2 className="text-3xl font-bold text-white mb-3 break-words">{title}</h2>
        <div className="flex items-center gap-4 text-white/90">
          <p className="font-medium">{date}</p>
          <p>•</p>
          <p className="break-words">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default EventSlide;
