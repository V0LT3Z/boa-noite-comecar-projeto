
import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventInfoBadgesProps {
  date: string;
  time: string;
  location: string;
}

const EventInfoBadges = ({ date, time, location }: EventInfoBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-charcoal-gray">
        <Calendar className="h-3.5 w-3.5 text-secondary-purple" />
        <span>{new Date(date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-charcoal-gray">
        <Clock className="h-3.5 w-3.5 text-tertiary-purple" />
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-charcoal-gray">
        <MapPin className="h-3.5 w-3.5 text-dark-purple" />
        <span className="line-clamp-1">{location}</span>
      </div>
    </div>
  );
};

export default EventInfoBadges;
