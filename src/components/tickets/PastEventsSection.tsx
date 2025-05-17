
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserTicket } from "@/types/event";
import { EventGroup } from "./TicketsContent";

interface PastEventsSectionProps {
  eventGroups: EventGroup[];
  onShowQR: (ticket: UserTicket) => void;
}

const PastEventsSection = ({ eventGroups, onShowQR }: PastEventsSectionProps) => {
  if (eventGroups.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Eventos Passados</h2>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventGroups.flatMap(group => 
                group.tickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.event_title}</TableCell>
                    <TableCell>{new Date(ticket.event_date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{ticket.ticket_type}</TableCell>
                    <TableCell>
                      {ticket.is_used ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Utilizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Disponível
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShowQR(ticket)}
                        className="hover:bg-gradient-primary hover:text-white transition-colors"
                      >
                        Ver QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastEventsSection;
