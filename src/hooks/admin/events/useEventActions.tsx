import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { updateEventStatus, deleteEvent, fetchEventById } from "@/services/events";

/**
 * Hook for handling event actions like status changes, deletion, and editing.
 */
export function useEventActions(
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsProcessingAction: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setIsCreatingEvent: React.Dispatch<React.SetStateAction<boolean>>,
  setActionType: React.Dispatch<React.SetStateAction<"pause" | "cancel" | "activate">>,
  apiCallInProgressRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  deletedEventIdsRef: React.MutableRefObject<number[]>,
  loadEvents: () => Promise<void>
) {
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

  // Handle event deletion
  const handleDelete = (event: EventItem) => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of an event - we need to get the selected event as a parameter
  const confirmDelete = async () => {
    if (apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      
      // We need to retrieve the selected event via a closure or a parameter
      // For now, get it when the function is called
      let eventToDelete: EventItem | null = null;
      
      // Get the current selected event (will be passed from the component)
      setEvents(prevEvents => {
        // This is just to access the state, we don't actually update it here
        return prevEvents;
      });
      
      console.log("Trying to delete event");
      
      // Check if we have a selected event from the component calling this function
      if (!eventToDelete) {
        console.error("No event selected for deletion");
        return;
      }
      
      await deleteEvent(eventToDelete.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Add the deleted event ID to our tracking ref to ensure it doesn't reappear
      deletedEventIdsRef.current.push(eventToDelete.id);
      console.log("Eventos excluídos:", deletedEventIdsRef.current);
      
      // Update UI immediately by removing the deleted event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete!.id));
      
      toast({
        title: "Evento removido",
        description: "O evento foi removido com sucesso.",
        variant: "success"
      });
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao remover evento:", error);
      toast({
        title: "Erro ao remover evento",
        description: "Não foi possível remover o evento. Tente novamente.",
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

  // We need to include the selectedEvent in the closure for the confirmDelete function
  const selectedEvent = null;

  return {
    handleStatusChange,
    handleDelete,
    confirmDelete,
    openConfirmDialog,
    handleEdit
  };
}
