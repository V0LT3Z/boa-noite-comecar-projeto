
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventItem, EventStatus } from "@/types/admin";
import { useAdminEvents } from "@/contexts/AdminEventsContext";

interface ConfirmActionDialogProps {
  open: boolean;
  onConfirm: (event: EventItem, newStatus: EventStatus) => void;
}

export const ConfirmActionDialog = ({ open, onConfirm }: ConfirmActionDialogProps) => {
  const { 
    selectedEvent, 
    actionType, 
    isProcessingAction,
    setConfirmDialogOpen
  } = useAdminEvents();

  if (!selectedEvent) return null;

  const getStatus = (): EventStatus => {
    if (actionType === "pause") return "paused";
    if (actionType === "cancel") return "cancelled";
    return "active";
  };

  const getTitle = () => {
    if (actionType === "pause") return "Pausar evento";
    if (actionType === "cancel") return "Cancelar evento";
    return "Ativar evento";
  };

  const getDescription = () => {
    if (actionType === "pause") {
      return `Tem certeza que deseja pausar o evento "${selectedEvent.title}"? Ele ficará invisível para novos compradores.`;
    }
    if (actionType === "cancel") {
      return `Tem certeza que deseja cancelar o evento "${selectedEvent.title}"? Esta ação não pode ser desfeita.`;
    }
    return `Tem certeza que deseja ativar o evento "${selectedEvent.title}"? Ele se tornará visível para compradores.`;
  };

  const getButtonText = () => {
    if (isProcessingAction) return "Processando...";
    if (actionType === "pause") return "Pausar evento";
    if (actionType === "cancel") return "Cancelar evento";
    return "Ativar evento";
  };

  const getButtonVariant = () => {
    if (actionType === "cancel") return "destructive";
    if (actionType === "pause") return "secondary";
    return "default";
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isProcessingAction) {
          setConfirmDialogOpen(open);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isProcessingAction) {
                setConfirmDialogOpen(false);
              }
            }}
            disabled={isProcessingAction}
          >
            Cancelar
          </Button>
          <Button 
            variant={getButtonVariant()} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm(selectedEvent, getStatus());
            }}
            disabled={isProcessingAction}
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
