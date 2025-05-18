
import { EventItem, EventStatus } from "@/types/admin";
import { useStatusActions } from "./actions/useStatusActions";
import { useDeleteActions } from "./actions/useDeleteActions";
import { useDialogActions } from "./actions/useDialogActions";
import { useEditActions } from "./actions/useEditActions";

/**
 * Main hook that composes all event action functionality
 */
export function useEventActions(
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsProcessingAction: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setIsCreatingEvent: React.Dispatch<React.SetStateAction<boolean>>,
  setActionType: React.Dispatch<React.SetStateAction<"pause" | "cancel" | "activate">>,
  apiCallInProgressRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>,
  deletedEventIdsRef: React.MutableRefObject<number[]>,
  loadEvents: () => Promise<void>
) {
  // Get status change functionality
  const { handleStatusChange } = useStatusActions(
    setEvents,
    setIsProcessingAction,
    setConfirmDialogOpen,
    setSelectedEvent,
    apiCallInProgressRef,
    isMountedRef
  );

  // Get deletion functionality
  const { handleDelete, confirmDelete } = useDeleteActions(
    setEvents,
    setSelectedEvent,
    setIsDeleting,
    setDeleteDialogOpen,
    apiCallInProgressRef,
    isMountedRef,
    deletedEventIdsRef
  );

  // Get dialog handling functionality
  const { openConfirmDialog } = useDialogActions(
    setSelectedEvent,
    setActionType,
    setConfirmDialogOpen
  );

  // Get editing functionality
  const { handleEdit } = useEditActions(
    setEditingEvent,
    setIsCreatingEvent,
    apiCallInProgressRef,
    isMountedRef
  );

  return {
    handleStatusChange,
    handleDelete,
    confirmDelete,
    openConfirmDialog,
    handleEdit
  };
}
