
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { EventList } from "@/components/admin/events/EventList";
import { DeleteEventDialog } from "@/components/admin/events/DeleteEventDialog";
import { 
  fetchEvents, 
  fetchEventById, 
  updateEventStatus,
  deleteEvent
} from "@/services/events";
import { format } from "date-fns";

export const EventsManager = () => {
  // Component state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Dialog state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");
  
  // Processing state
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs to prevent state updates during unmount
  const isMountedRef = useRef(true);
  const apiCallInProgressRef = useRef(false);

  // Reset mounted ref on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load events with useCallback to prevent unnecessary re-renders
  const loadEvents = useCallback(async () => {
    // Skip if we're already loading or unmounted
    if (apiCallInProgressRef.current || !isMountedRef.current) return;
    
    try {
      console.log("Iniciando carregamento de eventos");
      apiCallInProgressRef.current = true;
      setLoadingEvents(true);
      
      // Fetch events from the API
      const fetchedEvents = await fetchEvents();
      
      // Skip state update if component unmounted during fetch
      if (!isMountedRef.current) return;
      
      console.log(`Eventos carregados: ${fetchedEvents.length}`);
      
      // Format events for display
      const formattedEvents: EventItem[] = fetchedEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "yyyy-MM-dd"),
        status: (event.status as "active" | "paused" | "cancelled") || "active",
        ticketsSold: event.tickets_sold || 0,
        totalRevenue: 0,
        description: event.description || "",
        location: event.location || "",
        venue: event.location || "",
        minimumAge: event.minimum_age?.toString() || "0"
      }));
      
      setEvents(formattedEvents);
      console.log(`${formattedEvents.length} eventos carregados com sucesso`);
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Skip state update if component unmounted
      if (isMountedRef.current) {
        setLoadingEvents(false);
      }
      apiCallInProgressRef.current = false;
    }
  }, []);

  // Load events on mount and when event creation state changes
  useEffect(() => {
    if (!isCreatingEvent) {
      loadEvents();
    }
  }, [isCreatingEvent, loadEvents]);

  // Handle event status changes with improved error handling
  const handleStatusChange = async (eventId: number, newStatus: EventStatus) => {
    if (apiCallInProgressRef.current) {
      console.log("Uma operação já está em andamento, ignorando...");
      return;
    }
    
    try {
      apiCallInProgressRef.current = true;
      setIsProcessingAction(true);
      console.log(`Alterando status do evento ${eventId} para ${newStatus}`);
      
      // Update status in the API
      await updateEventStatus(eventId, newStatus);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Update local state optimistically for responsive UI
      setEvents(currentEvents => 
        currentEvents.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
      
      const action = 
        newStatus === "active" ? "ativado" : 
        newStatus === "paused" ? "pausado" : "cancelado";
      
      toast({
        title: `Evento ${action}`,
        description: `O evento foi ${action} com sucesso.`,
        variant: "success"
      });
      
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error(`Erro ao ${newStatus} evento:`, error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Reset state only if still mounted
      if (isMountedRef.current) {
        setIsProcessingAction(false);
        setConfirmDialogOpen(false);
        
        // Use timeout to ensure dialog is fully closed before resetting selection
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedEvent(null);
          }
        }, 300);
      }
      apiCallInProgressRef.current = false;
    }
  };

  // Handle event deletion - using permanent deletion
  const handleDelete = (event: EventItem) => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of an event - using permanent deletion
  const confirmDelete = async () => {
    if (!selectedEvent || apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      console.log(`Excluindo permanentemente o evento ${selectedEvent.id}`);
      
      // Excluir permanentemente o evento do banco de dados
      await deleteEvent(selectedEvent.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Remove o evento da lista local
      setEvents(currentEvents => currentEvents.filter(event => event.id !== selectedEvent.id));
      
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído permanentemente com sucesso.",
        variant: "success"
      });
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao excluir evento:", error);
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Reset state only if still mounted
      if (isMountedRef.current) {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        
        // Use timeout to ensure dialog is fully closed before resetting selection
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedEvent(null);
          }
        }, 300);
      }
      apiCallInProgressRef.current = false;
    }
  };

  // Open confirm dialog for status changes
  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  // Handle editing an event
  const handleEdit = async (event: EventItem) => {
    if (apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      console.log(`Carregando detalhes do evento ${event.id} para edição`);
      
      const eventDetails = await fetchEventById(event.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      if (eventDetails) {
        setEditingEvent({
          ...event,
          description: eventDetails.description || "",
          location: eventDetails.location || "",
          venue: eventDetails.venue?.name || "",
          minimumAge: eventDetails.minimumAge?.toString() || "0",
        });
        setIsCreatingEvent(true);
      } else {
        toast({
          title: "Erro ao editar evento",
          description: "Não foi possível carregar os detalhes do evento.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao buscar dados para edição:", error);
      toast({
        title: "Erro ao editar evento",
        description: "Não foi possível carregar os detalhes do evento.",
        variant: "destructive"
      });
    } finally {
      apiCallInProgressRef.current = false;
    }
  };

  // Navigation and form handlers
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
            <div className="flex gap-3">
              <Button onClick={handleNewEvent}>
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
          </div>
          
          <EventList
            events={events}
            loading={loadingEvents}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onEdit={handleEdit}
            onStatusAction={openConfirmDialog}
            onDeleteEvent={handleDelete}
            onCreateEvent={handleNewEvent}
          />
        </>
      )}

      {/* Status change confirmation dialog */}
      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          if (!isProcessingAction && isMountedRef.current) {
            setConfirmDialogOpen(open);
            if (!open) {
              // Clear state after dialog closes
              setTimeout(() => {
                if (isMountedRef.current) {
                  setSelectedEvent(null);
                }
              }, 300);
            }
          }
        }}
        selectedEvent={selectedEvent}
        actionType={actionType}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
        disabled={isProcessingAction}
      />

      {/* Delete event confirmation dialog */}
      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting && isMountedRef.current) {
            setDeleteDialogOpen(open);
            if (!open) {
              setTimeout(() => {
                if (isMountedRef.current) {
                  setSelectedEvent(null);
                }
              }, 300);
            }
          }
        }}
        selectedEvent={selectedEvent}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
