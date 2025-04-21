
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Edit, MoreHorizontal, PauseCircle, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventItem } from "@/types/admin";

interface EventsTableProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onStatusAction: (event: EventItem, action: "pause" | "cancel" | "activate") => void;
}

export const EventsTable = ({ events, onEdit, onStatusAction }: EventsTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Evento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ingressos Vendidos</TableHead>
            <TableHead className="text-right">Receita (R$)</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell><EventStatusBadge status={event.status} /></TableCell>
              <TableCell className="text-right">{event.ticketsSold}</TableCell>
              <TableCell className="text-right">
                {event.totalRevenue.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {event.status === "active" && (
                      <DropdownMenuItem 
                        onClick={() => onStatusAction(event, "pause")}
                        className="text-amber-600"
                      >
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Pausar
                      </DropdownMenuItem>
                    )}
                    {event.status === "paused" && (
                      <DropdownMenuItem 
                        onClick={() => onStatusAction(event, "activate")}
                        className="text-green-600"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Ativar
                      </DropdownMenuItem>
                    )}
                    {(event.status === "active" || event.status === "paused") && (
                      <DropdownMenuItem 
                        onClick={() => onStatusAction(event, "cancel")}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
