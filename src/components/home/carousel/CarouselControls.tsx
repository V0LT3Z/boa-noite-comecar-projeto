
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  eventsLength: number;
}

const CarouselControls = ({ onPrev, onNext, eventsLength }: CarouselControlsProps) => {
  if (eventsLength <= 1) return null;
  
  return (
    <div className="flex justify-between absolute -left-4 -right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
        className="bg-white p-3 rounded-full shadow-md hover:bg-white/90 transition-colors pointer-events-auto"
        aria-label="Evento anterior"
      >
        <ArrowLeft className="h-5 w-5 text-primary" />
      </button>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
        className="bg-white p-3 rounded-full shadow-md hover:bg-white/90 transition-colors pointer-events-auto"
        aria-label="Próximo evento"
      >
        <ArrowRight className="h-5 w-5 text-primary" />
      </button>
    </div>
  );
};

export default CarouselControls;
