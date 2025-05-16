
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
import { Calendar, MapPin, Info, ChevronRight, CircleDot } from 'lucide-react';
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

  // Current selected event for the info panel
  const currentEvent = events[selectedIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-soft-purple/10 to-soft-blue/10 p-6 rounded-xl">
      {/* Carousel section - left side */}
      <div className="lg:col-span-6">
        <div className="relative">
          <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
            <div className="relative">
              <CarouselContent ref={emblaRef}>
                {events.map((event) => (
                  <CarouselItem key={event.id} className="cursor-pointer">
                    <Link to={`/evento/${event.id}`}>
                      <div className="relative group h-[350px]">
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
      </div>
      
      {/* Event details panel - right side */}
      <div className="lg:col-span-6">
        <Card className="h-[350px] border-none shadow-lg bg-white p-6 flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              Evento em destaque
            </span>
            <h3 className="text-2xl font-bold mb-4">{currentEvent.title}</h3>
            <p className="text-gray-600 text-sm mb-6">
              Uma experiência imperdível que você precisa conferir!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-gray-700">{currentEvent.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-700">{currentEvent.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-gray-700">Classificação: Livre</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-auto">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-md"
              asChild
            >
              <Link to={`/evento/${currentEvent.id}`}>
                Comprar ingresso
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/5"
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
  );
};

export default FeaturedCarousel;
