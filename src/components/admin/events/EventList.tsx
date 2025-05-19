
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { EventItem } from "@/types/admin";
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
  onCreateEvent: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  loading,
  searchQuery,
  setSearchQuery,
  onEdit,
  onStatusAction,
  onDeleteEvent,
  onCreateEvent
}) => {
  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    // Filtrar por termo de busca
    return event.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
        />
      ) : (
        <EmptyEventsList onCreateEvent={onCreateEvent} />
      )}
    </div>
  );
};
