
import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Calendar, MapPin, Info, ChevronRight, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EventBanner {
  id: number;
  title: string;
  date: string;
  image: string;
}

interface HeroSectionProps {
  events: EventBanner[];
}

const HeroSection = ({ events }: HeroSectionProps) => {
  const hasEvents = events && events.length > 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayTimerRef = useRef<number | null>(null);
  
  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };
  
  // Monitor the selected index for the indicator dots
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Initialize with the current slide
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  // Setup auto-sliding for the carousel
  useEffect(() => {
    if (!emblaApi || !hasEvents) return;
    
    const autoplay = () => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0); // Loop back to the first slide
      }
    };
    
    // Clear any existing interval when component updates
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
    }
    
    // Set up new interval for auto-sliding every 5 seconds
    autoplayTimerRef.current = window.setInterval(autoplay, 5000);
    
    // Cleanup function to clear interval when component unmounts
    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [emblaApi, hasEvents]);

  const currentEvent = hasEvents ? events[selectedIndex] : null;
  
  if (!hasEvents) {
    return (
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl overflow-hidden h-[300px] flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl font-bold mb-2">Descubra eventos incríveis</h2>
          <p>Os melhores shows, festivais e experiências culturais</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-soft-purple to-soft-blue p-6 rounded-xl shadow-md">
      {/* Banner principal - carrossel (ocupando metade do espaço) */}
      <div className="lg:col-span-6">
        <div className="relative rounded-xl overflow-hidden shadow-lg h-[350px]">
          <Carousel>
            <div className="relative">
              <CarouselContent ref={emblaRef}>
                {events.map((event) => (
                  <CarouselItem key={event.id} className="cursor-pointer">
                    <Link to={`/evento/${event.id}`}>
                      <div className="relative h-[350px] group">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                          <p className="text-white/90 text-sm">
                            {event.date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 px-4">
                <CarouselPrevious className="bg-white/90 hover:bg-white border-0 h-10 w-10" />
                <CarouselNext className="bg-white/90 hover:bg-white border-0 h-10 w-10" />
              </div>
            </div>
          </Carousel>
          
          {/* Indicadores de slide */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="focus:outline-none"
                aria-label={`Ir para slide ${index + 1}`}
              >
                <CircleDot 
                  className={`h-2 w-2 ${
                    selectedIndex === index 
                      ? 'text-white fill-white' 
                      : 'text-white/40'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Detalhes do evento - mesmo tamanho que o carrossel */}
      {currentEvent && (
        <div className="lg:col-span-6">
          <Card className="h-[350px] border-none shadow-lg bg-white p-6 flex flex-col justify-between">
            <div>
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
                    <span className="text-gray-700">Local do evento</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Info className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">Classificação: Livre</span>
                  </div>
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
      )}
    </div>
  );
};

export default HeroSection;
