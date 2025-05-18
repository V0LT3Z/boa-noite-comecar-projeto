
import { EventItem } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: EventItem | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteEventDialog = ({
  open,
  onOpenChange,
  selectedEvent,
  onConfirm,
  isDeleting
}: DeleteEventDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar remoção</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Tem certeza que deseja remover permanentemente o evento <span className="font-semibold">{selectedEvent?.title}</span>? Esta ação não pode ser desfeita.
        </DialogDescription>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDeleting) {
                onOpenChange(false);
              }
            }}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Removendo..." : "Remover evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
