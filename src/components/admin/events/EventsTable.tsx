
import React from "react";
import { EventItem } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MoreHorizontal, ExternalLink, PenLine, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventStatusBadge } from "@/components/admin/events/EventStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EventsTableProps {
  events: EventItem[];
  onEdit: (event: EventItem) => void;
  onStatusAction: (
    event: EventItem,
    action: "pause" | "cancel" | "activate"
  ) => void;
  onDeleteEvent: (event: EventItem) => void;
}

export function EventsTable({
  events,
  onEdit,
  onStatusAction,
  onDeleteEvent
}: EventsTableProps) {
  // Handle view action - open event page in new tab
  const handleViewEvent = (id: number) => {
    window.open(`/evento/${id}`, "_blank");
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <span className="font-medium">{event.title}</span>
              </TableCell>
              <TableCell>
                <EventStatusBadge status={event.status} />
              </TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <PenLine className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {event.status !== "active" && (
                      <DropdownMenuItem
                        onClick={() => onStatusAction(event, "activate")}
                      >
                        <span className="mr-2">🟢</span>
                        Ativar
                      </DropdownMenuItem>
                    )}
                    {event.status !== "paused" && (
                      <DropdownMenuItem
                        onClick={() => onStatusAction(event, "pause")}
                      >
                        <span className="mr-2">⏸️</span>
                        Pausar
                      </DropdownMenuItem>
                    )}
                    {event.status !== "cancelled" && (
                      <DropdownMenuItem
                        onClick={() => onStatusAction(event, "cancel")}
                      >
                        <span className="mr-2">🚫</span>
                        Cancelar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDeleteEvent(event)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">Excluir</span>
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
}
