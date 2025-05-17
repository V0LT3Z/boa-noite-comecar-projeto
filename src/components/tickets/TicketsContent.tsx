
import { useState } from "react";
import { UserTicket } from "@/types/event";
import UpcomingEventsSection from "./UpcomingEventsSection";
import PastEventsSection from "./PastEventsSection";
import EmptyTickets from "./EmptyTickets";
import QRCodeModal from "./QRCodeModal";

export interface EventGroup {
  eventId: string; // Changed from number to string to match interface in other components
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets: UserTicket[];
}

interface TicketsContentProps {
  tickets: UserTicket[];
}

const TicketsContent = ({ tickets }: TicketsContentProps) => {
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  const handleShowQR = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setQrModalOpen(true);
  };

  const closeModal = () => {
    setQrModalOpen(false);
  };
  
  // Group tickets by event
  const groupTicketsByEvent = () => {
    const groupedTickets: Record<string, UserTicket[]> = {};
    
    tickets.forEach(ticket => {
      const key = `${ticket.event_id}-${ticket.event_title}`;
      if (!groupedTickets[key]) {
        groupedTickets[key] = [];
      }
      groupedTickets[key].push(ticket);
    });
    
    return Object.entries(groupedTickets).map(([key, tickets]) => ({
      eventId: String(tickets[0].event_id), // Convert number to string
      eventTitle: tickets[0].event_title,
      eventDate: tickets[0].event_date,
      eventLocation: tickets[0].event_location,
      tickets
    }));
  };
  
  const groupedTickets = groupTicketsByEvent();
  
  const upcomingEvents = groupedTickets.filter(group => 
    new Date(group.tickets[0].event_date) >= new Date()
  );
  
  const pastEvents = groupedTickets.filter(group => 
    new Date(group.tickets[0].event_date) < new Date()
  );
  
  if (tickets.length === 0) {
    return <EmptyTickets />;
  }
  
  return (
    <div className="space-y-8">
      <UpcomingEventsSection 
        eventGroups={upcomingEvents}
        onShowQR={handleShowQR}
      />
      
      <PastEventsSection 
        eventGroups={pastEvents}
        onShowQR={handleShowQR}
      />
      
      {selectedTicket && (
        <QRCodeModal 
          selectedTicket={selectedTicket}
          isOpen={qrModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TicketsContent;
