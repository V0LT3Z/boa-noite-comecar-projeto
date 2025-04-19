
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MarketplaceTicket {
  id: number;
  eventId: number;
  eventName: string;
  eventImage: string;
  location: string;
  date: string;
  ticketType: string;
  originalPrice: number;
  price: number;
  seller: string;
  quantity: number;
  category: string;
}

interface MarketplaceTicketCardProps {
  ticket: MarketplaceTicket;
}

const MarketplaceTicketCard = ({ ticket }: MarketplaceTicketCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-24 h-24 sm:w-32 sm:h-32 relative flex-shrink-0">
            <img
              src={ticket.eventImage}
              alt={ticket.eventName}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-1 p-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{ticket.eventName}</h3>
              <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{ticket.location}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                  {ticket.ticketType}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between">
              <div className="text-right">
                <div className="font-bold text-lg">
                  R$ {ticket.price.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ticket.quantity} disponível
                </div>
              </div>
              
              <Link to={`/marketplace/${ticket.id}`}>
                <Button size="sm" className="gap-1">
                  Ver detalhes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceTicketCard;
