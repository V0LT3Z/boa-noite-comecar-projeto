
import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from '@/hooks/use-toast';

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
  const [hasError, setHasError] = useState(false);
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
      try {
        const index = emblaApi.selectedScrollSnap();
        console.log("Embla selected index:", index);
        
        // Validate that the index is within bounds
        if (index >= 0 && index < events.length) {
          setSelectedIndex(index);
        } else {
          console.warn("Embla returned invalid index:", index, "Max index:", events.length - 1);
          setSelectedIndex(0); // Fallback to first slide
        }
      } catch (error) {
        console.error("Error in Embla onSelect:", error);
        setHasError(true);
        // Try to recover
        try {
          emblaApi.reInit();
          setSelectedIndex(0);
        } catch (reinitError) {
          console.error("Failed to reinitialize Embla carousel:", reinitError);
        }
      }
    };
    
    try {
      emblaApi.on('select', onSelect);
      onSelect(); // Set initial selected index
    } catch (error) {
      console.error("Error setting up Embla carousel event handlers:", error);
      setHasError(true);
    }
    
    return () => {
      try {
        emblaApi.off('select', onSelect);
      } catch (error) {
        console.error("Error cleaning up Embla carousel event handlers:", error);
      }
    };
  }, [emblaApi, events.length]);
  
  // Setup autoplay functionality with better error handling
  useEffect(() => {
    if (!emblaApi || events.length <= 1 || hasError) return;
    
    const autoplay = () => {
      if (!isTransitioning && emblaApi) {
        try {
          setIsTransitioning(true);
          
          if (emblaApi.canScrollNext()) {
            emblaApi.scrollNext();
          } else {
            emblaApi.scrollTo(0);
          }
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500); // Match this with transition duration
        } catch (error) {
          console.error("Error during carousel autoplay:", error);
          setIsTransitioning(false);
          setHasError(true);
          
          // Notify user subtly
          toast({
            title: "Problema no carrossel",
            description: "Recarregando automaticamente...",
            variant: "default"
          });
          
          // Try to recover by reinitializing
          try {
            emblaApi.reInit();
          } catch (reinitError) {
            console.error("Failed to reinitialize carousel after error:", reinitError);
          }
        }
      }
    };
    
    // Clear any existing interval when component updates
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    // Set new interval for auto-sliding
    autoplayTimerRef.current = window.setInterval(autoplay, 6000);
    
    // Cleanup function
    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [emblaApi, events.length, isTransitioning, hasError]);

  // Garantir que temos pelo menos um evento válido e seguro para usar
  const safeEvents = events.filter(event => 
    event && typeof event.id === 'number' && 
    typeof event.title === 'string' &&
    typeof event.date === 'string' &&
    typeof event.location === 'string'
  );
  
  // Se não houver eventos válidos, não renderizar nada
  if (safeEvents.length === 0) {
    return null;
  }

  // Current selected event for the info panel - with safety checks
  const currentEventIndex = Math.min(selectedIndex, safeEvents.length - 1);
  const currentEvent = safeEvents[currentEventIndex >= 0 ? currentEventIndex : 0];
  
  // Improved navigation functions with error handling
  const scrollNext = () => {
    if (isTransitioning || !emblaApi) return;
    
    try {
      console.log("scrollNext called, current index:", selectedIndex);
      setIsTransitioning(true);
      
      // Sync with embla carousel
      emblaApi.scrollNext();
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition duration
    } catch (error) {
      console.error("Error scrolling to next slide:", error);
      setIsTransitioning(false);
      
      // Try to recover
      try {
        emblaApi.reInit();
      } catch (reinitError) {
        console.error("Failed to reinitialize after scroll error:", reinitError);
      }
    }
  };
  
  const scrollPrev = () => {
    if (isTransitioning || !emblaApi) return;
    
    try {
      console.log("scrollPrev called, current index:", selectedIndex);
      setIsTransitioning(true);
      
      // Sync with embla carousel
      emblaApi.scrollPrev();
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition duration
    } catch (error) {
      console.error("Error scrolling to previous slide:", error);
      setIsTransitioning(false);
      
      // Try to recover
      try {
        emblaApi.reInit();
      } catch (reinitError) {
        console.error("Failed to reinitialize after scroll error:", reinitError);
      }
    }
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
    <ErrorBoundary>
      <div className="relative w-full bg-gradient-to-br from-soft-purple/5 to-soft-blue/5">
        <div className="mx-auto max-w-[1400px] px-4 relative">
          {/* External navigation arrows */}
          <CarouselControls 
            onPrev={scrollPrev}
            onNext={scrollNext}
            eventsLength={safeEvents.length}
          />

          {/* Main content grid - banner and details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
            {/* Carousel section - larger size */}
            <div className="lg:col-span-8">
              <div>
                <div className="relative overflow-hidden rounded-3xl shadow-xl h-[420px]">
                  <div className="relative h-full w-full" ref={emblaRef}>
                    <div className="flex h-full">
                      {safeEvents.map((event, index) => (
                        <div className="flex-full min-w-0 relative h-full w-full" key={`event-slide-container-${event.id}-${index}`}>
                          <EventSlide 
                            key={`event-slide-${event.id}-${index}`}
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
              <ErrorBoundary>
                {currentEvent && <EventInfoPanel {...currentEvent} />}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FeaturedCarousel;
