
import { useEffect } from "react";

/**
 * Hook for handling cleanup operations in the events management.
 */
export function useCleanup(
  isMountedRef: React.MutableRefObject<boolean>,
  deletedEventIdsRef: React.MutableRefObject<number[]>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<any | null>>,
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsProcessingAction: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Reset mounted ref on unmount
  useEffect(() => {
    isMountedRef.current = true;
    deletedEventIdsRef.current = [];
    
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef, deletedEventIdsRef]);

  // Close all dialogs and reset state on unmount
  useEffect(() => {
    return () => {
      setSelectedEvent(null);
      setConfirmDialogOpen(false);
      setDeleteDialogOpen(false);
      setIsProcessingAction(false);
      setIsDeleting(false);
    };
  }, [setSelectedEvent, setConfirmDialogOpen, setDeleteDialogOpen, setIsProcessingAction, setIsDeleting]);
}
