
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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  console.log("FeaturedCarousel received events:", events);
  
  // Preload all images to prevent white flashes
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = events.length;
    
    const preloadImages = events.map(event => {
      return new Promise((resolve) => {
        if (event.image) {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              setImagesLoaded(true);
            }
            resolve(null);
          };
          img.onerror = () => resolve(null);
          img.src = event.image;
        } else {
          resolve(null);
        }
      });
    });
    
    Promise.all(preloadImages).then(() => {
      setImagesLoaded(true);
    });
  }, [events]);
  
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

  if (!imagesLoaded) {
    return (
      <div className="relative mx-auto px-8 md:px-16 lg:px-20 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-soft-purple/10 to-soft-blue/10 p-6 rounded-xl">
          <div className="lg:col-span-8">
            <div className="h-[420px] rounded-3xl bg-gray-200 animate-pulse"></div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-[420px] rounded-3xl bg-gray-100 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="relative h-[420px]">
                {events.map((event, index) => (
                  <EventSlide 
                    key={event.id}
                    {...event} 
                    isActive={index === selectedIndex}
                  />
                ))}
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
