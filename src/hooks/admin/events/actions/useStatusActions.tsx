import { toast } from "@/hooks/use-toast";
import { EventItem } from "@/types/admin";
import { updateEventStatus } from "@/services/events";

/**
 * Hook for handling event status change actions
 */
export function useStatusActions(
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>,
  setIsProcessingAction: React.Dispatch<React.SetStateAction<boolean>>,
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  apiCallInProgressRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
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

  return { handleStatusChange };
}
