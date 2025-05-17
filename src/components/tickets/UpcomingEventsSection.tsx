
import { UserTicket } from "@/types/event";
import EventGroupCard from "./EventGroupCard";

interface EventGroup {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: UserTicket[];
}

interface UpcomingEventsSectionProps {
  eventGroups: EventGroup[];
  onShowQR: (ticket: UserTicket) => void;
}

const UpcomingEventsSection = ({ eventGroups, onShowQR }: UpcomingEventsSectionProps) => {
  if (eventGroups.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Próximos Eventos</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {eventGroups.map((eventGroup) => (
          <EventGroupCard 
            key={eventGroup.eventId}
            eventId={eventGroup.eventId}
            eventTitle={eventGroup.eventTitle}
            eventDate={eventGroup.eventDate}
            eventLocation={eventGroup.eventLocation}
            tickets={eventGroup.tickets}
            onShowQR={onShowQR}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
