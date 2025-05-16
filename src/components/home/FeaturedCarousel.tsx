
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import { CircleDot } from 'lucide-react';

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
    
    console.log("Carousel autoplay set up");
    
    // Cleanup function
    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
      }
    };
  }, [emblaApi, events.length]);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative">
          <CarouselContent ref={emblaRef}>
            {events.map((event) => (
              <CarouselItem key={event.id} className="cursor-pointer">
                <Link to={`/evento/${event.id}`}>
                  <div className="relative group h-[450px]">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 mix-blend-multiply" />
                    <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
                      <span className="inline-block px-4 py-1 bg-primary/80 text-white text-sm rounded-full mb-4">
                        Em destaque
                      </span>
                      <h2 className="text-4xl font-bold text-white mb-3">{event.title}</h2>
                      <div className="flex items-center gap-4 text-white/90">
                        <p className="font-medium">{event.date}</p>
                        <p>•</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 px-4">
            <CarouselPrevious className="left-6 bg-white/90 hover:bg-white" />
            <CarouselNext className="right-6 bg-white/90 hover:bg-white" />
          </div>
          
          {/* Indicator dots */}
          {events.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className="focus:outline-none"
                  aria-label={`Ir para slide ${index + 1}`}
                >
                  <CircleDot 
                    className={`h-3 w-3 ${
                      selectedIndex === index 
                        ? 'text-white fill-white' 
                        : 'text-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
};

export default FeaturedCarousel;
