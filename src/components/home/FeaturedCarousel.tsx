
import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from '@/hooks/use-toast';
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
  // Verify events before doing anything
  if (!events || events.length === 0) return null;
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    dragFree: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  
  // Simplified states to reduce re-renders
  const [isError, setIsError] = useState(false);
  
  // Load images after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setImagesReady(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle carousel slide selection - simplified
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      try {
        const index = emblaApi.selectedScrollSnap();
        setSelectedIndex(Math.min(index, events.length - 1));
      } catch (error) {
        console.error("Error in carousel selection:", error);
        setIsError(true);
      }
    };
    
    emblaApi.on('select', onSelect);
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, events.length]);
  
  // Simplified autoplay functionality
  useEffect(() => {
    if (!emblaApi || events.length <= 1 || isError) return;
    
    const interval = setInterval(() => {
      try {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      } catch (error) {
        console.error("Autoplay error:", error);
        setIsError(true);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [emblaApi, events.length, isError]);

  // Safe filtering of events
  const safeEvents = events.filter(event => 
    event && typeof event.id === 'number' && 
    typeof event.title === 'string'
  );
  
  // If no valid events, render nothing
  if (safeEvents.length === 0) return null;
  
  // Current selected event for the info panel
  const currentEvent = safeEvents[Math.min(selectedIndex, safeEvents.length - 1) || 0];
  
  // Simplified navigation functions
  const scrollNext = () => {
    if (!emblaApi) return;
    try {
      emblaApi.scrollNext();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  
  const scrollPrev = () => {
    if (!emblaApi) return;
    try {
      emblaApi.scrollPrev();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Loading state
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
          <CarouselControls 
            onPrev={scrollPrev}
            onNext={scrollNext}
            eventsLength={safeEvents.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl">
            <div className="lg:col-span-8">
              <div>
                <div className="relative overflow-hidden rounded-3xl shadow-xl h-[420px]">
                  <div className="relative h-full w-full" ref={emblaRef}>
                    <div className="flex h-full">
                      {safeEvents.map((event, index) => (
                        <div className="flex-full min-w-0 relative h-full w-full" key={`event-slide-${event.id}-${index}`}>
                          <EventSlide 
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
