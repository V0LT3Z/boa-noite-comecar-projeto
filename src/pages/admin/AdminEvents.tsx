
import { AdminLayout } from "@/components/admin/AdminLayout";
import EventForm from "@/components/admin/EventForm";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { DeleteEventDialog } from "@/components/admin/events/DeleteEventDialog";
import { AdminEventsList } from "@/components/admin/events/AdminEventsList";
import EventFormHeader from "@/components/admin/events/EventFormHeader";
import { useEventsManagement } from "@/components/admin/events/useEventsManagement";

const AdminEvents = () => {
  const {
    isCreatingEvent,
    editingEvent,
    searchQuery,
    setSearchQuery,
    events,
    loadingEvents,
    selectedEvent,
    setSelectedEvent, // Added this line - destructuring setSelectedEvent from the hook
    confirmDialogOpen,
    setConfirmDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    actionType,
    isProcessingAction,
    isDeleting,
    filteredEvents,
    handleStatusChange,
    handleDelete,
    confirmDelete,
    openConfirmDialog,
    handleEdit,
    handleFormBack,
    handleNewEvent,
    handleFormSuccess,
  } = useEventsManagement();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {isCreatingEvent ? (
          <>
            <EventFormHeader 
              isEditing={!!editingEvent}
              eventTitle={editingEvent?.title}
              onBack={handleFormBack}
            />
            <EventForm event={editingEvent} onSuccess={handleFormSuccess} />
          </>
        ) : (
          <AdminEventsList 
            events={events}
            filteredEvents={filteredEvents}
            searchQuery={searchQuery}
            loadingEvents={loadingEvents}
            onSearchChange={setSearchQuery}
            onEdit={handleEdit}
            onStatusAction={openConfirmDialog}
            onDeleteEvent={handleDelete}
            onCreateNew={handleNewEvent}
          />
        )}
      </div>

      {/* Status change confirmation dialog */}
      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          if (!isProcessingAction) {
            setConfirmDialogOpen(open);
            if (!open) {
              // Clear state after dialog closes
              setTimeout(() => {
                setSelectedEvent(null);
              }, 300);
            }
          }
        }}
        selectedEvent={selectedEvent}
        actionType={actionType}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
        disabled={isProcessingAction}
      />

      {/* Delete event confirmation dialog */}
      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteDialogOpen(open);
            if (!open) {
              // Clear state after dialog closes
              setTimeout(() => {
                setSelectedEvent(null);
              }, 300);
            }
          }
        }}
        selectedEvent={selectedEvent}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
};

export default AdminEvents;
