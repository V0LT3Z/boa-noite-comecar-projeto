
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

interface RestoreEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: EventItem | null;
  onConfirm: () => void;
  isRestoring: boolean;
}

export const RestoreEventDialog: React.FC<RestoreEventDialogProps> = ({
  open,
  onOpenChange,
  selectedEvent,
  onConfirm,
  isRestoring
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar restauração</DialogTitle>
          <DialogDescription>
            Deseja restaurar o evento <span className="font-semibold">{selectedEvent?.title}</span>? 
            Ele voltará a aparecer na página inicial.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isRestoring) {
                onOpenChange(false);
              }
            }}
            disabled={isRestoring}
          >
            Cancelar
          </Button>
          <Button 
            variant="default" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isRestoring}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRestoring ? "Restaurando..." : "Restaurar evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
