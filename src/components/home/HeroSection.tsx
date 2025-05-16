
import React, { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { CircleDot, Calendar, MapPin, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // Se não houver eventos, exibimos um banner genérico
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
  
  return (
    <section className="py-10 overflow-hidden">
      <div className="container mx-auto px-4">
        {hasEvents ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Banner principal - lado esquerdo */}
            <div className="w-full lg:w-3/4">
              <div className="relative">
                <Carousel>
                  <div className="relative">
                    <CarouselContent ref={emblaRef} className="rounded-xl overflow-hidden">
                      {events.map((event) => (
                        <CarouselItem key={event.id} className="cursor-pointer">
                          <Link to={`/evento/${event.id}`}>
                            <div className="relative h-[300px] md:h-[450px] group">
                              <img 
                                src={event.image} 
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 mix-blend-multiply" />
                              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/90 to-transparent">
                                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{event.title}</h2>
                                <p className="text-white/90 text-sm md:text-base">
                                  {event.date}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    <div className="absolute inset-y-0 -left-5 -right-5 flex items-center justify-between z-20 pointer-events-none">
                      <div className="pointer-events-auto">
                        <CarouselPrevious className="bg-white/90 hover:bg-white border-0 h-10 w-10 md:h-12 md:w-12" />
                      </div>
                      <div className="pointer-events-auto">
                        <CarouselNext className="bg-white/90 hover:bg-white border-0 h-10 w-10 md:h-12 md:w-12" />
                      </div>
                    </div>
                  </div>
                </Carousel>
              </div>
              
              {/* Indicadores de pontos para acompanhar o slide atual */}
              <div className="flex justify-center gap-2 mt-4">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className="focus:outline-none"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <CircleDot 
                      className={`h-3 w-3 transition-all ${
                        selectedIndex === index 
                          ? 'text-primary fill-primary' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Informações do evento - lado direito */}
            {currentEvent && (
              <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{currentEvent.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        A incrível produção chega para uma noite épica de shows!
                      </p>
                    
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-gray-700">{currentEvent.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span className="text-gray-700">Espaço de Eventos</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Info className="h-5 w-5 text-primary" />
                          <span className="text-gray-700">Classificação: 18 anos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <Link to={`/evento/${currentEvent.id}`}>
                        Comprar ingresso
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      asChild
                    >
                      <Link to={`/evento/${currentEvent.id}`} className="flex items-center justify-center">
                        Saiba mais <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-[350px] md:h-[450px] rounded-xl border-2 border-primary overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80"></div>
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Descubra os melhores eventos</h2>
                <p className="text-white/90 text-lg">Explore shows, festivais e muito mais!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
