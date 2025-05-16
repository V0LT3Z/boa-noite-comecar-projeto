
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventInfoPanelProps {
  id: number;
  title: string;
  date: string;
  location: string;
}

const EventInfoPanel = ({ id, title, date, location }: EventInfoPanelProps) => {
  return (
    <Card className="h-[420px] border-none shadow-lg bg-white p-6 flex flex-col">
      <ScrollArea className="flex-grow pr-4 mb-4">
        <h3 className="text-xl font-bold mb-4 break-words">{title}</h3>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-base">{date}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-base break-words">{location}</span>
          </div>
        </div>
      </ScrollArea>
      
      <div className="space-y-4 mt-auto flex-shrink-0">
        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-md py-6"
          asChild
        >
          <Link to={`/evento/${id}`}>
            Comprar ingresso
          </Link>
        </Button>
        
        <Button 
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/5 py-6"
          asChild
        >
          <Link to={`/evento/${id}`} className="flex items-center justify-center">
            Mais detalhes <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default EventInfoPanel;
