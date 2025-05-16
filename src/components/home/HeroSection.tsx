
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';

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
  
  return (
    <section className="relative bg-gradient-to-r from-purple-100 to-blue-100 pt-16 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
        <div className="absolute right-10 top-40 w-60 h-60 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
        <div className="absolute left-1/2 bottom-0 w-80 h-80 rounded-full bg-pink-300 opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {hasEvents ? (
            <Carousel className="relative overflow-hidden rounded-xl shadow-xl">
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id} className="cursor-pointer">
                    <Link to={`/evento/${event.id}`}>
                      <div className="relative h-[350px] md:h-[450px] group">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 mix-blend-multiply" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/90 to-transparent">
                          <span className="inline-block px-4 py-1 bg-primary/80 text-white text-xs md:text-sm rounded-full mb-2 md:mb-4">
                            Em destaque
                          </span>
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
              <CarouselPrevious className="left-4 md:left-6 bg-white/90 hover:bg-white" />
              <CarouselNext className="right-4 md:right-6 bg-white/90 hover:bg-white" />
            </Carousel>
          ) : (
            <div className="relative h-[350px] md:h-[450px] rounded-xl overflow-hidden">
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
      </div>
    </section>
  );
};

export default HeroSection;
