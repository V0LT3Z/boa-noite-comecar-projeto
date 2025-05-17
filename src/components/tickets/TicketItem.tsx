
import { Button } from "@/components/ui/button";
import { UserTicket } from "@/types/event";

interface TicketItemProps {
  ticket: UserTicket;
  onShowQR: (ticket: UserTicket) => void;
}

const TicketItem = ({ ticket, onShowQR }: TicketItemProps) => {
  return (
    <div 
      className={`p-3 rounded-lg flex justify-between items-center ${ticket.is_used ? 'bg-gray-100' : 'bg-soft-purple'}`}
    >
      <div>
        <p className="font-medium">{ticket.ticket_type}</p>
        <p className="text-xs text-dashboard-muted">
          Código: {ticket.qr_code.substring(0, 8)}...
        </p>
      </div>
      <Button
        onClick={() => onShowQR(ticket)}
        variant="secondary"
        size="sm"
        className="bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        Ver QR
      </Button>
    </div>
  );
};

export default TicketItem;
