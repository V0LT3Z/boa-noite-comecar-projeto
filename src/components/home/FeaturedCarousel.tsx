
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import { Calendar, MapPin, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    if (emblaApi) emblaApi.scrollNext();
  };
  
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  return (
    <div className="relative mx-auto px-8 md:px-16 lg:px-20 max-w-[1400px]">
      {/* External navigation arrows - posicionadas dentro do container de 1400px */}
      {events.length > 1 && (
        <div className="flex justify-between absolute -left-4 -right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <button 
            onClick={scrollPrev}
            className="bg-white p-3 rounded-full shadow-md hover:bg-white/90 transition-colors pointer-events-auto"
            aria-label="Evento anterior"
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
          
          <button 
            onClick={scrollNext}
            className="bg-white p-3 rounded-full shadow-md hover:bg-white/90 transition-colors pointer-events-auto"
            aria-label="Próximo evento"
          >
            <ArrowRight className="h-5 w-5 text-primary" />
          </button>
        </div>
      )}

      {/* Main content grid - banner and details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-soft-purple/10 to-soft-blue/10 p-6 rounded-xl">
        {/* Carousel section - larger size */}
        <div className="lg:col-span-8">
          <div>
            <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
              <div className="relative">
                <CarouselContent ref={emblaRef}>
                  {events.map((event) => (
                    <CarouselItem key={event.id} className="cursor-pointer">
                      <Link to={`/evento/${event.id}`}>
                        <div className="relative group h-[420px]">
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
                            <h2 className="text-3xl font-bold text-white mb-3">{event.title}</h2>
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
              </div>
            </Carousel>
          </div>
        </div>
        
        {/* Event details panel - smaller right side */}
        <div className="lg:col-span-4">
          <Card className="h-[420px] border-none shadow-lg bg-white p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">{currentEvent.title}</h3>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-gray-700 text-base">{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-700 text-base line-clamp-2">{currentEvent.location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-md py-6"
                asChild
              >
                <Link to={`/evento/${currentEvent.id}`}>
                  Comprar ingresso
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/5 py-6"
                asChild
              >
                <Link to={`/evento/${currentEvent.id}`} className="flex items-center justify-center">
                  Mais detalhes <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
