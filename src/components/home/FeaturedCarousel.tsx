
import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Componentes refatorados
import CarouselControls from './carousel/CarouselControls';
import EventSlide from './carousel/EventSlide';
import EventInfoPanel from './carousel/EventInfoPanel';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status?: string;
}

interface FeaturedCarouselProps {
  events: EventItem[];
}

const FeaturedCarousel = ({ events }: FeaturedCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    dragFree: false
  });
  const autoplayTimerRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  
  // Filtrar eventos nulos ou inválidos
  const validEvents = events.filter(event => 
    event && event.id && event.title && event.image
  );
  
  // Verificar se temos eventos válidos
  if (validEvents.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-br from-soft-purple/5 to-soft-blue/5">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
            <div className="lg:col-span-8">
              <div className="h-[420px] rounded-3xl bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Sem eventos em destaque disponíveis</p>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="h-[420px] rounded-3xl bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Detalhes do evento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Garantir que o índice selecionado seja válido
  useEffect(() => {
    if (selectedIndex >= validEvents.length && validEvents.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, validEvents.length]);
  
  // Handle carousel slide selection
  useEffect(() => {
    if (!emblaApi || validEvents.length === 0) return;
    
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(Math.min(index, validEvents.length - 1));
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Set initial selected index
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, validEvents.length]);
  
  // Setup autoplay functionality
  useEffect(() => {
    if (!emblaApi || validEvents.length <= 1) return;
    
    const autoplay = () => {
      if (!isTransitioning && emblaApi.canScrollNext()) {
        setIsTransitioning(true);
        emblaApi.scrollNext();
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500); // Match this with transition duration
      } else if (!isTransitioning) {
        setIsTransitioning(true);
        emblaApi.scrollTo(0);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500); // Match this with transition duration
      }
    };
    
    // Clear any existing interval when component updates
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
    }
    
    // Set new interval for auto-sliding
    autoplayTimerRef.current = window.setInterval(autoplay, 6000);
    
    // Cleanup function
    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
      }
    };
  }, [emblaApi, validEvents.length, isTransitioning]);

  // Current selected event for the info panel
  const currentEvent = validEvents[selectedIndex] || validEvents[0];
  
  // Improved navigation functions
  const scrollNext = () => {
    if (isTransitioning || validEvents.length === 0) return;
    
    setIsTransitioning(true);
    
    // Calculate next index and update state
    const nextIndex = (selectedIndex + 1) % validEvents.length;
    setSelectedIndex(nextIndex);
    
    // Sync with embla carousel
    if (emblaApi) {
      emblaApi.scrollTo(nextIndex);
    }
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  };
  
  const scrollPrev = () => {
    if (isTransitioning || validEvents.length === 0) return;
    
    setIsTransitioning(true);
    
    // Calculate previous index and update state
    const prevIndex = selectedIndex === 0 ? validEvents.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    
    // Sync with embla carousel
    if (emblaApi) {
      emblaApi.scrollTo(prevIndex);
    }
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-soft-purple/5 to-soft-blue/5">
      <div className="mx-auto max-w-[1400px] px-4 relative">
        {/* External navigation arrows */}
        <CarouselControls 
          onPrev={scrollPrev}
          onNext={scrollNext}
          eventsLength={validEvents.length}
        />

        {/* Main content grid - banner and details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
          {/* Carousel section - larger size */}
          <div className="lg:col-span-8">
            <div>
              <div className="relative overflow-hidden rounded-3xl shadow-xl h-[420px]">
                <div className="relative h-full w-full" ref={slidesRef}>
                  {validEvents.map((event, index) => (
                    <EventSlide 
                      key={`event-slide-${event.id}-${index}`}
                      {...event} 
                      isActive={index === selectedIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Event details panel - smaller right side */}
          <div className="lg:col-span-4">
            <EventInfoPanel {...currentEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
