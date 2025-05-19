
import { useEffect } from "react";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { useAdminEvents } from "@/contexts/AdminEventsContext";

export const EventListContent = () => {
  const { 
    loadingEvents,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    events,
    handleEdit,
    openConfirmDialog,
    handleDelete,
    handleNewEvent,
    loadEvents,
    deletedEventIds
  } = useAdminEvents();

  // Load events when component mounts and refresh after deletion
  useEffect(() => {
    // Initial load with force refresh to ensure we have latest data
    loadEvents(true);
    
    // Add an interval to reload events periodically
    const refreshInterval = setInterval(() => {
      console.log("Recarregando eventos para garantir dados atualizados");
      loadEvents(true); // Force cache refresh
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadEvents, deletedEventIds]); // Re-run when deletedEventIds changes

  // Filter events to exclude any deleted ones
  const displayEvents = filteredEvents.filter(event => {
    return !deletedEventIds.has(event.id);
  });

  return (
    <div className="border rounded-lg">
      <EventSearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        events={events}
        autoFocus={true}
      />
      
      {loadingEvents ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : displayEvents.length > 0 ? (
        <EventsTable 
          events={displayEvents} 
          onEdit={handleEdit}
          onStatusAction={openConfirmDialog}
          onDeleteEvent={handleDelete}
        />
      ) : (
        <EmptyEventsList onCreateEvent={handleNewEvent} />
      )}
    </div>
  );
};
