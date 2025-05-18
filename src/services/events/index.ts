
// Export all event-related services from a single entry point

// Event fetching
export { 
  fetchEvents, 
  fetchEventById,
  mapEventResponse
} from './eventsFetching';

// Event mutations
export {
  createEvent,
  updateEvent
} from './eventsMutation';

// Status management
export { updateEventStatus } from './statusManagement';

// Ticket management
export { deleteTicketType } from './ticketManagement';

// User tickets
export { fetchUserTickets } from './userTickets';

// Event deletion
export { deleteEvent } from './eventDeletion';
