
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
import { useEffect } from "react";

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
  
  const handleConfirm = () => {
    if (!selectedEvent || disabled) return;
    
    const newStatus = 
      actionType === "pause" ? "paused" : 
      actionType === "cancel" ? "cancelled" : "active";
      
    onConfirm(selectedEvent, newStatus as "active" | "paused" | "cancelled");
  };
  
  // Reset state when dialog closes
  useEffect(() => {
    // Esta função só é executada quando o open muda
    return () => {
      // Cleanup quando o componente é desmontado ou quando open muda
      // Não precisamos fazer nada específico aqui, mas o efeito
      // garante que o componente rerenderize corretamente
    };
  }, [open]);
  
  // Se não houver evento selecionado, não renderizar o diálogo
  if (!selectedEvent) {
    return null;
  }
  
  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!disabled) {
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
          <AlertDialogCancel disabled={disabled}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
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
