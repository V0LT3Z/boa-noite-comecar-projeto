
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
    loadEvents
  } = useAdminEvents();

  // Load events when component mounts
  useEffect(() => {
    // Carregar eventos imediatamente
    loadEvents();
    
    // Adicionar um intervalo para recarregar eventos periodicamente (a cada 30 segundos)
    const refreshInterval = setInterval(() => {
      console.log("Recarregando eventos para garantir dados atualizados");
      loadEvents();
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadEvents]);

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
      ) : filteredEvents.length > 0 ? (
        <EventsTable 
          events={filteredEvents} 
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
