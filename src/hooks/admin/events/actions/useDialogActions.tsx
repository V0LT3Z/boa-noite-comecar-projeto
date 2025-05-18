
import { EventItem } from "@/types/admin";

/**
 * Hook for handling dialog-related actions
 */
export function useDialogActions(
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>,
  setActionType: React.Dispatch<React.SetStateAction<"pause" | "cancel" | "activate">>,
  setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Open confirm dialog for status changes
  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  return { openConfirmDialog };
}
