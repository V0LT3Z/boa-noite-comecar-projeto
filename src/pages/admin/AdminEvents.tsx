
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { fetchEvents } from "@/services/events";
import { format } from "date-fns";

const AdminEvents = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const fetchedEvents = await fetchEvents();
      
      const formattedEvents: EventItem[] = fetchedEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "yyyy-MM-dd"),
        status: (event.status as "active" | "paused" | "cancelled") || "active",
        ticketsSold: event.tickets_sold || 0,
        totalRevenue: 0,
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (!isCreatingEvent) {
      loadEvents();
    }
  }, [isCreatingEvent]);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (eventId: number, newStatus: EventStatus) => {
    setEvents(currentEvents => 
      currentEvents.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
    
    setConfirmDialogOpen(false);
    setSelectedEvent(null);
    
    const action = 
      newStatus === "active" ? "ativado" : 
      newStatus === "paused" ? "pausado" : "cancelado";
    
    toast({
      title: `Evento ${action}`,
      description: `O evento foi ${action} com sucesso.`,
      variant: "success"
    });
  };

  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    setSelectedEvent(event);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsCreatingEvent(true);
  };

  const handleFormBack = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsCreatingEvent(true);
  };
  
  const handleFormSuccess = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
    loadEvents();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {isCreatingEvent ? (
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={handleFormBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                {editingEvent ? `Editar Evento: ${editingEvent.title}` : "Criar Novo Evento"}
              </h1>
            </div>
            <EventForm event={editingEvent} onSuccess={handleFormSuccess} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
              <Button onClick={handleNewEvent}>
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <EventSearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
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
                />
              ) : (
                <EmptyEventsList onCreateEvent={handleNewEvent} />
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        selectedEvent={selectedEvent}
        actionType={actionType}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
      />
    </AdminLayout>
  );
};

export default AdminEvents;
