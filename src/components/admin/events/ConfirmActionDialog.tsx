
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventItem } from "@/types/admin";
import { useEffect, useRef } from "react";

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: EventItem | null;
  actionType: "pause" | "cancel" | "activate";
  onConfirm: (event: EventItem, status: "active" | "paused" | "cancelled") => void;
  disabled?: boolean;
}

export const ConfirmActionDialog = ({
  open,
  onOpenChange,
  selectedEvent,
  actionType,
  onConfirm,
  disabled = false
}: ConfirmActionDialogProps) => {
  // Use a ref to track if we're in the middle of processing
  const isProcessingRef = useRef(disabled);
  
  // Update ref when disabled prop changes
  useEffect(() => {
    isProcessingRef.current = disabled;
  }, [disabled]);
  
  // Clean up when dialog closes
  useEffect(() => {
    if (!open && isProcessingRef.current) {
      // Reset processing state if we were processing and dialog closed
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 300);
    }
  }, [open]);
  
  const handleConfirm = () => {
    if (!selectedEvent || isProcessingRef.current) return;
    
    const newStatus = 
      actionType === "pause" ? "paused" : 
      actionType === "cancel" ? "cancelled" : "active";
    
    // Create a deep copy of the event object to prevent any state mutation
    const eventCopy = JSON.parse(JSON.stringify(selectedEvent));
    
    // Close the dialog first
    onOpenChange(false);
    
    // Set a small delay to ensure UI updates before proceeding with the action
    setTimeout(() => {
      onConfirm(eventCopy, newStatus as "active" | "paused" | "cancelled");
    }, 50);
  };
  
  // Safety check - if no event is selected, don't render
  if (!selectedEvent) {
    return null;
  }
  
  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow changing if not currently processing
        if (!isProcessingRef.current) {
          onOpenChange(isOpen);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {actionType === "pause" ? "Pausar evento" : 
             actionType === "cancel" ? "Cancelar evento" : "Ativar evento"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {actionType === "pause" && "Isso irá pausar as vendas de ingressos para este evento. Você poderá reativá-lo a qualquer momento."}
            {actionType === "cancel" && "Isso irá cancelar o evento e todas as vendas em andamento. Esta ação não pode ser desfeita."}
            {actionType === "activate" && "Isso irá ativar o evento e permitir que as vendas de ingressos continuem."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={disabled} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isProcessingRef.current) {
                onOpenChange(false);
              }
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleConfirm();
            }}
            disabled={disabled}
            className={
              actionType === "cancel" ? "bg-destructive hover:bg-destructive/90" :
              actionType === "activate" ? "bg-green-600 hover:bg-green-700" :
              "bg-amber-500 hover:bg-amber-600"
            }
          >
            {disabled ? "Processando..." : (
              actionType === "pause" ? "Pausar" : 
              actionType === "cancel" ? "Cancelar" : "Ativar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
