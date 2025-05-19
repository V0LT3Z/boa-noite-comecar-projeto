
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { EventItem } from "@/types/admin";
import { RotateCcw } from "lucide-react";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";

interface EventListProps {
  events: EventItem[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEdit: (event: EventItem) => void;
  onStatusAction: (event: EventItem, action: "pause" | "cancel" | "activate") => void;
  onDeleteEvent: (event: EventItem) => void;
  onRestoreEvent: (event: EventItem) => void;
  onCreateEvent: () => void;
  deletedEventIds: number[];
}

export const EventList: React.FC<EventListProps> = ({
  events,
  loading,
  searchQuery,
  setSearchQuery,
  onEdit,
  onStatusAction,
  onDeleteEvent,
  onRestoreEvent,
  onCreateEvent,
  deletedEventIds
}) => {
  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    // Filtrar por termo de busca
    return event.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Renderizar badge de status "Excluído localmente" para eventos excluídos
  const renderEventStatus = (event: EventItem) => {
    const isDeleted = deletedEventIds.includes(event.id);
    
    if (isDeleted) {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
            Excluído
          </span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onRestoreEvent(event);
            }}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Restaurar
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="border rounded-lg">
      <EventSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        events={events}
        autoFocus={true}
      />
      
      {loading ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <EventsTable 
          events={filteredEvents} 
          onEdit={onEdit}
          onStatusAction={onStatusAction}
          onDeleteEvent={onDeleteEvent}
          renderExtraStatus={renderEventStatus}
          deletedEventIds={deletedEventIds}
        />
      ) : (
        <EmptyEventsList onCreateEvent={onCreateEvent} />
      )}
    </div>
  );
};
