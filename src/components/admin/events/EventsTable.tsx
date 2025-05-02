
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Edit, MoreHorizontal, PauseCircle, Play, Trash2, X } from "lucide-react";
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
  onDeleteEvent: (event: EventItem) => void;
}

export const EventsTable = ({ events, onEdit, onStatusAction, onDeleteEvent }: EventsTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Improved action handler with better event handling
  const handleAction = (
    event: React.MouseEvent, 
    callback: Function, 
    ...args: any[]
  ) => {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Clone any objects to prevent state mutation
    const clonedArgs = args.map(arg => 
      typeof arg === 'object' && arg !== null ? {...arg} : arg
    );
    
    // Close dropdown first to prevent UI freezing
    setTimeout(() => callback(...clonedArgs), 10);
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
                    <DropdownMenuItem 
                      onClick={(e) => handleAction(e, onEdit, event)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {event.status === "active" && (
                      <DropdownMenuItem 
                        onClick={(e) => handleAction(e, onStatusAction, event, "pause")}
                        className="text-amber-600"
                      >
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Pausar
                      </DropdownMenuItem>
                    )}
                    {event.status === "paused" && (
                      <DropdownMenuItem 
                        onClick={(e) => handleAction(e, onStatusAction, event, "activate")}
                        className="text-green-600"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Ativar
                      </DropdownMenuItem>
                    )}
                    {(event.status === "active" || event.status === "paused") && (
                      <DropdownMenuItem 
                        onClick={(e) => handleAction(e, onStatusAction, event, "cancel")}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => handleAction(e, onDeleteEvent, event)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover evento
                    </DropdownMenuItem>
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
