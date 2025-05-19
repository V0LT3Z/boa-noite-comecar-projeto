
import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { DeleteEventDialog } from "@/components/admin/events/DeleteEventDialog";
import { EventListHeader } from "@/components/admin/events/EventListHeader";
import { EventListContent } from "@/components/admin/events/EventListContent";
import { EventFormWrapper } from "@/components/admin/events/EventFormWrapper";
import { AdminEventsProvider, useAdminEvents } from "@/contexts/AdminEventsContext";

// This component must be used inside the AdminEventsProvider
const AdminEventsContent = () => {
  const { isCreatingEvent, confirmDialogOpen, handleStatusChange, loadEvents } = useAdminEvents();

  // Load events when component mounts and force a fresh load
  useEffect(() => {
    loadEvents(true); // Force fresh data on mount
    
    // Clean up component state on unmount
    return () => {
      // This empty cleanup function ensures the context unmount handler works properly
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

      {/* Status change confirmation dialog */}
      <ConfirmActionDialog
        open={confirmDialogOpen}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
      />

      {/* Delete event confirmation dialog */}
      <DeleteEventDialog />
    </div>
  );
};

// Wrap the entire component with AdminEventsProvider
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
