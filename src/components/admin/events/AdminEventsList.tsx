
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventItem } from "@/types/admin";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";

interface AdminEventsListProps {
  events: EventItem[];
  filteredEvents: EventItem[];
  searchQuery: string;
  loadingEvents: boolean;
  onSearchChange: (query: string) => void;
  onEdit: (event: EventItem) => void;
  onStatusAction: (event: EventItem, action: "pause" | "cancel" | "activate") => void;
  onDeleteEvent: (event: EventItem) => void;
  onCreateNew: () => void;
}

export const AdminEventsList = ({
  events,
  filteredEvents,
  searchQuery,
  loadingEvents,
  onSearchChange,
  onEdit,
  onStatusAction,
  onDeleteEvent,
  onCreateNew,
}: AdminEventsListProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
        <div className="flex gap-3">
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo Evento
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <EventSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange}
          events={events}
          autoFocus={true}
        />
        
        {loadingEvents ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventsTable 
            events={filteredEvents} 
            onEdit={onEdit}
            onStatusAction={onStatusAction}
            onDeleteEvent={onDeleteEvent}
          />
        ) : (
          <EmptyEventsList onCreateEvent={onCreateNew} />
        )}
      </div>
    </>
  );
};
