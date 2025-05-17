
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { UserTicket } from "@/types/event";
import TicketItem from "./TicketItem";

interface EventGroupCardProps {
  eventId: string; // Changed from number to string
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: UserTicket[];
  onShowQR: (ticket: UserTicket) => void;
}

const EventGroupCard = ({ 
  eventTitle, 
  eventDate, 
  eventLocation, 
  tickets, 
  onShowQR 
}: EventGroupCardProps) => {
  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow text-left">
      <CardHeader className="bg-gradient-primary text-white p-4">
        <h3 className="text-xl font-bold">{eventTitle}</h3>
        <div className="flex items-center text-sm opacity-90">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(eventDate).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
        <div className="flex items-center text-sm opacity-90">
          <MapPin className="mr-2 h-4 w-4" />
          {eventLocation}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="font-medium mb-2">Seus ingressos:</p>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <TicketItem 
              key={ticket.id} 
              ticket={ticket} 
              onShowQR={onShowQR} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventGroupCard;
