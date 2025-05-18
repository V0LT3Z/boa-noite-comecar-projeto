
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
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setDeleteDialogOpen(true);
  };

  // Confirm and execute event deletion
  const confirmDelete = async () => {
    if (apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      
      // Get the current selected event - this will come from the component
      let selectedEvent: EventItem | null = null;
      
      // We'll use a closure to access the selected event later
      setSelectedEvent(current => {
        selectedEvent = current;
        return current;
      });
      
      if (!selectedEvent) {
        console.error("No event selected for deletion");
        return;
      }
      
      console.log(`Removing event ${selectedEvent.id}`);
      
      await deleteEvent(selectedEvent.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Add the deleted event ID to our tracking ref to ensure it doesn't reappear
      deletedEventIdsRef.current.push(selectedEvent.id);
      console.log("Eventos excluídos:", deletedEventIdsRef.current);
      
      // Update UI immediately by removing the deleted event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent!.id));
      
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
  
  return { handleDelete, confirmDelete };
}
