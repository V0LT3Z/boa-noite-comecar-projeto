
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminEvents } from "@/contexts/AdminEventsContext";

export const DeleteEventDialog = () => {
  const { 
    selectedEvent, 
    deleteDialogOpen, 
    setDeleteDialogOpen, 
    confirmDelete,
    isDeleting
  } = useAdminEvents();

  return (
    <Dialog 
      open={deleteDialogOpen} 
      onOpenChange={(open) => {
        if (!isDeleting) {
          setDeleteDialogOpen(open);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar remoção</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover permanentemente o evento <span className="font-semibold">{selectedEvent?.title}</span>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDeleting) {
                setDeleteDialogOpen(false);
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
              confirmDelete();
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
