
import { toast } from "@/hooks/use-toast";
import { EventItem } from "@/types/admin";
import { deleteEvent } from "@/services/events";

/**
 * Hook for handling event deletion actions
 */
export function useDeleteActions(
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  apiCallInProgressRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  deletedEventIdsRef: React.MutableRefObject<number[]>
) {
  // Prepare for event deletion
  const handleDelete = (event: EventItem) => {
    try {
      // Create a deep copy to prevent mutations
      const eventCopy = JSON.parse(JSON.stringify(event));
      setSelectedEvent(eventCopy);
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Error preparing event for deletion:", error);
      toast({
        title: "Erro",
        description: "Não foi possível preparar o evento para exclusão",
        variant: "destructive"
      });
    }
  };

  // Confirm and execute event deletion
  const confirmDelete = async () => {
    if (apiCallInProgressRef.current) {
      console.log("API call already in progress, skipping");
      return;
    }
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      
      // Get the current selected event
      let selectedEvent: EventItem | null = null;
      
      // Use a closure to access the selected event
      setSelectedEvent(current => {
        selectedEvent = current;
        return current;
      });
      
      if (!selectedEvent || !selectedEvent.id) {
        console.error("No event selected for deletion or missing ID");
        throw new Error("Evento inválido para exclusão");
      }
      
      console.log(`Removing event ${selectedEvent.id}`);
      
      const result = await deleteEvent(selectedEvent.id);
      console.log("Delete event result:", result);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Add the deleted event ID to tracking ref
      deletedEventIdsRef.current.push(selectedEvent.id);
      console.log("Eventos excluídos:", deletedEventIdsRef.current);
      
      // Update UI by removing the deleted event
      setEvents(prevEvents => {
        return prevEvents.filter(event => event.id !== selectedEvent!.id);
      });
      
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
        
        // Use timeout to ensure dialog is fully closed before resetting
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedEvent(null);
          }
        }, 300);
      }
      apiCallInProgressRef.current = false;
    }
  };
  
  return { handleDelete, confirmDelete };
}
