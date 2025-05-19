
import { useAdminEvents } from "@/contexts/AdminEventsContext";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";

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
    deletedEventIds
  } = useAdminEvents();

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
