
import React from "react";
import GradientCard from "@/components/GradientCard";
import { Button } from "@/components/ui/button";

interface EventVenueInfoProps {
  venue: {
    name: string;
    address: string;
    capacity: number;
    map_url: string;
  };
  isMobile: boolean;
}

const EventVenueInfo = ({ venue, isMobile }: EventVenueInfoProps) => {
  return (
    <GradientCard className="w-full">
      <h2 className={`text-${isMobile ? 'base' : 'lg'} font-semibold mb-2 text-gray-800`}>Local do Evento</h2>
      <p className={`text-gray-700 text-${isMobile ? 'sm' : 'base'}`}>
        <span className="font-semibold">{venue.name}</span><br />
        {venue.address}<br />
        Capacidade: <span className="font-medium">{venue.capacity}</span>
      </p>
      <Button
        variant="link"
        asChild
        className="mt-1 p-0 text-primary hover:text-secondary"
      >
        <a href={venue.map_url} target="_blank" rel="noopener noreferrer">
          Ver no Mapa
        </a>
      </Button>
    </GradientCard>
  );
};

export default EventVenueInfo;
