
import { useState, useRef } from "react";
import { EventItem } from "@/types/admin";

/**
 * Handles the state management for the events administration.
 * Extracts the state logic from the main useEventsManagement hook.
 */
export function useEventsState() {
  // Component state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Dialog state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");
  
  // Processing state
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs to prevent state updates during unmount
  const isMountedRef = useRef(true);
  const apiCallInProgressRef = useRef(false);
  const deletedEventIdsRef = useRef<number[]>([]);

  return {
    // Component state
    isCreatingEvent,
    setIsCreatingEvent,
    editingEvent, 
    setEditingEvent,
    searchQuery,
    setSearchQuery,
    events,
    setEvents,
    loadingEvents,
    setLoadingEvents,
    
    // Dialog state
    selectedEvent,
    setSelectedEvent,
    confirmDialogOpen,
    setConfirmDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    actionType,
    setActionType,
    
    // Processing state
    isProcessingAction,
    setIsProcessingAction,
    isDeleting,
    setIsDeleting,
    
    // Refs
    isMountedRef,
    apiCallInProgressRef,
    deletedEventIdsRef
  };
}
