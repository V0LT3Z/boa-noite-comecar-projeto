
import { useEventsState } from "./useEventsState";
import { useEventsData } from "./useEventsData";
import { useEventActions } from "./useEventActions";
import { useFormHandling } from "./useFormHandling";
import { useCleanup } from "./useCleanup"; 
import { EventItem } from "@/types/admin";

/**
 * Main hook for events management. Composes smaller hooks to provide
 * complete event management functionality.
 */
export function useEventsManagement() {
  // Get all state from useEventsState
  const state = useEventsState();
  
  const {
    events, setEvents,
    loadingEvents, setLoadingEvents,
    searchQuery,
    isCreatingEvent, setIsCreatingEvent,
    editingEvent, setEditingEvent,
    selectedEvent, setSelectedEvent,
    confirmDialogOpen, setConfirmDialogOpen,
    deleteDialogOpen, setDeleteDialogOpen,
    actionType, setActionType,
    isProcessingAction, setIsProcessingAction,
    isDeleting, setIsDeleting,
    isMountedRef, apiCallInProgressRef, deletedEventIdsRef
  } = state;

  // Get events data loading and filtering functionality
  const { loadEvents, getFilteredEvents } = useEventsData(
    setEvents,
    setLoadingEvents,
    isCreatingEvent,
    searchQuery,
    apiCallInProgressRef,
    isMountedRef,
    deletedEventIdsRef
  );

  // Get event action handlers
  const { 
    handleStatusChange,
    handleDelete,
    confirmDelete,
    openConfirmDialog,
    handleEdit
  } = useEventActions(
    setEvents,
    setSelectedEvent,
    setConfirmDialogOpen,
    setDeleteDialogOpen,
    setIsProcessingAction,
    setIsDeleting,
    setEditingEvent,
    setIsCreatingEvent,
    setActionType,
    apiCallInProgressRef,
    isMountedRef,
    deletedEventIdsRef,
    loadEvents
  );

  // Get form handling methods
  const {
    handleFormBack,
    handleNewEvent,
    handleFormSuccess
  } = useFormHandling(setIsCreatingEvent, setEditingEvent, loadEvents);

  // Setup cleanup effects
  useCleanup(
    isMountedRef,
    deletedEventIdsRef,
    setSelectedEvent,
    setConfirmDialogOpen,
    setDeleteDialogOpen,
    setIsProcessingAction,
    setIsDeleting
  );

  // Filter events based on search query
  const filteredEvents = getFilteredEvents(events);
  
  return {
    isCreatingEvent,
    editingEvent,
    searchQuery,
    setSearchQuery,
    events,
    loadingEvents,
    selectedEvent,
    setSelectedEvent,
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
  };
}

export type { EventItem };
