
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  eventsLength: number;
}

const CarouselControls = ({ onPrev, onNext, eventsLength }: CarouselControlsProps) => {
  if (eventsLength <= 1) return null;
  
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Prev button clicked");
    onPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Next button clicked");
    onNext();
  };
  
  return (
    <div className="flex justify-between absolute -left-4 -right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <button 
        onClick={handlePrevClick}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Evento anterior"
        type="button"
      >
        <ArrowLeft className="h-5 w-5 text-primary" />
      </button>
      
      <button 
        onClick={handleNextClick}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Próximo evento"
        type="button"
      >
        <ArrowRight className="h-5 w-5 text-primary" />
      </button>
    </div>
  );
};

export default CarouselControls;
