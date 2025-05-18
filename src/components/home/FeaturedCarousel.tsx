
import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

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
  const [imagesReady, setImagesReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  
  console.log("FeaturedCarousel received events:", events);
  
  // Verificar se há eventos disponíveis
  if (!events || events.length === 0) {
    console.log("Nenhum evento disponível para o carrossel");
    return null;
  }
  
  // Load images after component mounts
  useEffect(() => {
    // Set images ready after a short timeout to allow the component to mount
    const timer = setTimeout(() => {
      setImagesReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle carousel slide selection
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      console.log("Embla selected index:", index);
      setSelectedIndex(index);
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Set initial selected index
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  // Setup autoplay functionality
  useEffect(() => {
    if (!emblaApi || events.length <= 1) return;
    
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
  }, [emblaApi, events.length, isTransitioning]);

  // Garantir que temos pelo menos um evento
  if (events.length === 0) {
    return null;
  }

  // Current selected event for the info panel
  const currentEvent = events[selectedIndex] || events[0];
  
  // Improved navigation functions
  const scrollNext = () => {
    if (isTransitioning || !emblaApi) return;
    
    console.log("scrollNext called, current index:", selectedIndex);
    setIsTransitioning(true);
    
    // Sync with embla carousel
    emblaApi.scrollNext();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  };
  
  const scrollPrev = () => {
    if (isTransitioning || !emblaApi) return;
    
    console.log("scrollPrev called, current index:", selectedIndex);
    setIsTransitioning(true);
    
    // Sync with embla carousel
    emblaApi.scrollPrev();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
  };

  if (!imagesReady) {
    return (
      <div className="relative w-full bg-gradient-to-br from-soft-purple/5 to-soft-blue/5">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
            <div className="lg:col-span-8">
              <div className="h-[420px] rounded-3xl bg-gray-200 animate-pulse"></div>
            </div>
            <div className="lg:col-span-4">
              <div className="h-[420px] rounded-3xl bg-gray-100 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-soft-purple/5 to-soft-blue/5">
      <div className="mx-auto max-w-[1400px] px-4 relative">
        {/* External navigation arrows */}
        <CarouselControls 
          onPrev={scrollPrev}
          onNext={scrollNext}
          eventsLength={events.length}
        />

        {/* Main content grid - banner and details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
          {/* Carousel section - larger size */}
          <div className="lg:col-span-8">
            <div>
              <div className="relative overflow-hidden rounded-3xl shadow-xl h-[420px]">
                <div className="relative h-full w-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {events.map((event, index) => (
                      <div className="flex-full min-w-0 relative h-full w-full" key={`event-slide-container-${event.id}`}>
                        <EventSlide 
                          key={`event-slide-${event.id}`}
                          {...event} 
                          isActive={index === selectedIndex}
                        />
                      </div>
                    ))}
                  </div>
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
