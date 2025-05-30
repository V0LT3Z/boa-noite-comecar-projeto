
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  eventsLength: number;
}

const CarouselControls = ({ onPrev, onNext, eventsLength }: CarouselControlsProps) => {
  if (eventsLength <= 1) return null;
  
  return (
    <div className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-white/80 shadow-md text-primary hover:bg-white ml-4 pointer-events-auto font-gooddog z-30"
        onClick={onPrev}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only font-gooddog">Anterior</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-white/80 shadow-md text-primary hover:bg-white mr-4 pointer-events-auto font-gooddog z-30"
        onClick={onNext}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only font-gooddog">Próximo</span>
      </Button>
    </div>
  );
};

export default CarouselControls;
