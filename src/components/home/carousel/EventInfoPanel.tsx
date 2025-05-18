
import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FavoriteButton from '@/components/FavoriteButton';

interface EventInfoPanelProps {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status?: string;
}

const EventInfoPanel = ({ id, title, date, location, image, status }: EventInfoPanelProps) => {
  const [imageError, setImageError] = useState(false);
  // Generate a consistent fallback image
  const fallbackImage = `https://picsum.photos/seed/event${id}/600/400`;
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md h-[420px] flex flex-col">
      {/* Header image with smaller size */}
      <div className="relative h-[180px] overflow-hidden">
        <img 
          src={imageError ? fallbackImage : image} 
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        
        {/* Status badge if cancelled */}
        {status === "cancelled" && (
          <div className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded-full text-xs font-bold text-white">
            Cancelado
          </div>
        )}
        
        {/* Favorite button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton eventId={id} variant="icon" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        
        <div className="flex flex-col gap-3 flex-grow">
          {/* Date info */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          
          {/* Location info */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-auto pt-4">
          <Link to={`/evento/${id}`} className="w-full block">
            <Button 
              variant="default" 
              className="w-full bg-gradient-primary" 
              disabled={status === "cancelled"}
            >
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventInfoPanel;
