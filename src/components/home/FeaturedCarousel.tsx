
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
        <CarouselContent>
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
        <CarouselPrevious className="left-6 bg-white/90 hover:bg-white" />
        <CarouselNext className="right-6 bg-white/90 hover:bg-white" />
      </Carousel>
    </div>
  );
};

export default FeaturedCarousel;
