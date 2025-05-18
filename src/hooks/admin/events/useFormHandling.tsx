
/**
 * Hook for handling form-related actions in the events management.
 */
export function useFormHandling(
  setIsCreatingEvent: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingEvent: React.Dispatch<React.SetStateAction<any | null>>,
  loadEvents: () => Promise<void>
) {
  // Navigation and form handlers
  const handleFormBack = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsCreatingEvent(true);
  };
  
  const handleFormSuccess = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
    loadEvents();
  };

  return {
    handleFormBack,
    handleNewEvent,
    handleFormSuccess
  };
}
