
import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { DeleteEventDialog } from "@/components/admin/events/DeleteEventDialog";
import { EventListHeader } from "@/components/admin/events/EventListHeader";
import { EventListContent } from "@/components/admin/events/EventListContent";
import { EventFormWrapper } from "@/components/admin/events/EventFormWrapper";
import { AdminEventsProvider, useAdminEvents } from "@/contexts/AdminEventsContext";

// Este componente deve ser usado dentro do AdminEventsProvider
const AdminEventsContent = () => {
  const { isCreatingEvent, confirmDialogOpen, handleStatusChange, loadEvents } = useAdminEvents();

  // Carregar eventos quando o componente é montado, mas apenas uma vez
  useEffect(() => {
    // Utilizamos um timeout para garantir que o carregamento inicial seja rápido
    const timer = setTimeout(() => {
      loadEvents(true);
    }, 100);
    
    // Limpar o timeout ao desmontar
    return () => {
      clearTimeout(timer);
    };
  }, [loadEvents]);

  return (
    <div className="space-y-6">
      {isCreatingEvent ? (
        <EventFormWrapper />
      ) : (
        <>
          <EventListHeader />
          <EventListContent />
        </>
      )}

      {/* Diálogo de confirmação de alteração de status */}
      <ConfirmActionDialog
        open={confirmDialogOpen}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
      />

      {/* Diálogo de confirmação de exclusão de evento */}
      <DeleteEventDialog />
    </div>
  );
};

// Envolva todo o componente com AdminEventsProvider
const AdminEvents = () => {
  return (
    <AdminLayout>
      <AdminEventsProvider>
        <AdminEventsContent />
      </AdminEventsProvider>
    </AdminLayout>
  );
};

export default AdminEvents;
