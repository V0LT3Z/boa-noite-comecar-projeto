
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { EventItem } from "@/types/admin";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: EventItem | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteEventDialog: React.FC<DeleteEventDialogProps> = ({
  open,
  onOpenChange,
  selectedEvent,
  onConfirm,
  isDeleting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja esconder o evento <span className="font-semibold">{selectedEvent?.title}</span>? 
            Ele não aparecerá mais na página inicial, mas poderá ser restaurado depois.
          </DialogDescription>
        </DialogHeader>
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
            {isDeleting ? "Excluindo..." : "Excluir evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
