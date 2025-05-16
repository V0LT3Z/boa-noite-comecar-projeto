
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const autoplayTimerRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  console.log("FeaturedCarousel received events:", events);
  
  // Handle carousel slide selection
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
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
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    };
    
    // Clear any existing interval when component updates
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
    }
    
    // Set new interval for auto-sliding
    autoplayTimerRef.current = window.setInterval(autoplay, 5000);
    
    // Cleanup function
    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
      }
    };
  }, [emblaApi, events.length]);

  if (events.length === 0) {
    return null;
  }

  // Current selected event for the info panel
  const currentEvent = events[selectedIndex] || events[0];
  
  // Navigation functions
  const scrollNext = () => {
    if (emblaApi) {
      // Manually update the index for immediate UI update
      const nextIndex = (selectedIndex + 1) % events.length;
      setSelectedIndex(nextIndex);
      emblaApi.scrollTo(nextIndex);
    }
  };
  
  const scrollPrev = () => {
    if (emblaApi) {
      // Manually update the index for immediate UI update
      const prevIndex = selectedIndex === 0 ? events.length - 1 : selectedIndex - 1;
      setSelectedIndex(prevIndex);
      emblaApi.scrollTo(prevIndex);
    }
  };

  return (
    <div className="relative mx-auto px-8 md:px-16 lg:px-20 max-w-[1400px]">
      {/* External navigation arrows */}
      <CarouselControls 
        onPrev={scrollPrev}
        onNext={scrollNext}
        eventsLength={events.length}
      />

      {/* Main content grid - banner and details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-soft-purple/10 to-soft-blue/10 p-6 rounded-xl">
        {/* Carousel section - larger size */}
        <div className="lg:col-span-8">
          <div>
            <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
              <div className="relative">
                <CarouselContent ref={emblaRef}>
                  {events.map((event, index) => (
                    <CarouselItem key={event.id} className="cursor-pointer">
                      <EventSlide 
                        {...event} 
                        isActive={index === selectedIndex}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
            </Carousel>
          </div>
        </div>
        
        {/* Event details panel - smaller right side */}
        <div className="lg:col-span-4">
          <EventInfoPanel {...currentEvent} />
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
