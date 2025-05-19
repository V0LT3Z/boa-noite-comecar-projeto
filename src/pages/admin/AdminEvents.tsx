
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
  const { isCreatingEvent, confirmDialogOpen, deleteDialogOpen, handleStatusChange, loadEvents } = useAdminEvents();

  // Carregar eventos quando o componente é montado e forçar uma atualização
  useEffect(() => {
    loadEvents(true); // Forçar dados novos ao montar
    
    // Limpar o estado do componente ao desmontar
    return () => {
      // Esta função de limpeza vazia garante que o manipulador de desmontagem do contexto funcione corretamente
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
