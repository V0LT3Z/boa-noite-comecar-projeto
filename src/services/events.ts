
import { format } from "date-fns";

// Re-export event fetching functions
export { 
  fetchEvents, 
  fetchEventById, 
  fetchUserTickets 
} from './eventFetching';

// Re-export event management functions
export { createEvent, updateEvent, updateEventStatus } from './eventManagement';
export { deleteTicketType, deleteEvent } from './ticketOperations';
export { processImageUrl } from './utils/imageUtils';

// Simple functions to handle local UI state for deleted events
// These are temporary stubs to fix build errors
export const markEventAsLocallyDeleted = (id: number) => {
  // This function is now a no-op since we're doing permanent deletions
  console.log(`Local deletion tracking for event ${id} is no longer used - events are deleted permanently`);
};

export const isEventLocallyDeleted = (id: number) => {
  // Always return false since we don't track local deletions anymore
  return false;
};

export const getLocallyDeletedEvents = () => {
  // Return empty array since we don't track local deletions anymore
  return [];
};
