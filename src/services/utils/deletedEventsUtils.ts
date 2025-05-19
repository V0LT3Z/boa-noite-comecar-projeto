
/**
 * Utility functions to manage deleted event IDs across the application
 * This ensures consistency between admin and public views
 */

// Store deleted event IDs in a consistent localStorage key
const DELETED_EVENTS_KEY = 'deleted_event_ids';

/**
 * Get the set of deleted event IDs from localStorage
 */
export const getDeletedEventIds = (): Set<number> => {
  try {
    const savedDeletedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (savedDeletedIds) {
      const parsedIds = JSON.parse(savedDeletedIds);
      if (Array.isArray(parsedIds)) {
        console.log(`Loaded ${parsedIds.length} deleted event IDs: ${parsedIds.join(', ')}`);
        return new Set(parsedIds.map(id => Number(id)));
      }
    }
    console.log('No deleted event IDs found in localStorage');
    return new Set();
  } catch (error) {
    console.error("Error loading deleted IDs from localStorage:", error);
    return new Set();
  }
};

/**
 * Add an event ID to the deleted events set
 */
export const addDeletedEventId = (eventId: number): void => {
  try {
    const deletedIds = getDeletedEventIds();
    deletedIds.add(eventId);
    const idsArray = Array.from(deletedIds);
    localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(idsArray));
    console.log(`Event ID ${eventId} marked as deleted. Total: ${idsArray.length} IDs saved.`);
  } catch (error) {
    console.error("Error saving deleted ID to localStorage:", error);
  }
};

/**
 * Check if an event ID is in the deleted set
 */
export const isEventDeleted = (eventId: number): boolean => {
  const isDeleted = getDeletedEventIds().has(eventId);
  if (isDeleted) {
    console.log(`Event ID ${eventId} is marked as deleted.`);
  }
  return isDeleted;
};

/**
 * Clear all deleted event IDs (useful for testing)
 */
export const clearDeletedEventIds = (): void => {
  try {
    localStorage.removeItem(DELETED_EVENTS_KEY);
    console.log('All deleted event IDs removed from localStorage');
  } catch (error) {
    console.error("Error clearing deleted IDs from localStorage:", error);
  }
};
