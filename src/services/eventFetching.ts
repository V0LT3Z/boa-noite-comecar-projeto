import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse } from "@/types/event";
import { mapEventResponse } from "./utils/eventMappers";
import { processImageUrl } from "./utils/imageUtils";
import { format } from "date-fns";
import { getDeletedEventIds } from "./utils/deletedEventsUtils";

/**
 * Fetch all events from the database
 */
export const fetchEvents = async (forceRefresh = false) => {
  try {
    console.log("Fetching all events", forceRefresh ? "(forcing cache refresh)" : "");
    
    // When forceRefresh is true, add cache prevention headers
    const options = forceRefresh ? {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    } : undefined;
    
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .throwOnError();

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
    
    console.log(`Events found: ${events?.length || 0}`);
    
    // Process all image URLs
    if (events) {
      events.forEach(event => {
        event.image_url = processImageUrl(event.image_url, event.id);
      });
    }
    
    // Get the current set of deleted event IDs directly from localStorage
    const deletedEventIds = getDeletedEventIds();
    
    // If there are deleted events, filter them out immediately
    if (deletedEventIds.size > 0) {
      console.log(`Filtering ${deletedEventIds.size} deleted events during fetchEvents`);
      const filteredEvents = events?.filter(event => !deletedEventIds.has(event.id));
      console.log(`Events after filtering: ${filteredEvents?.length || 0}`);
      return filteredEvents as EventResponse[];
    }
    
    return events as EventResponse[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (id: number) => {
  try {
    console.log("Fetching event with ID:", id);
    
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id);

    if (eventError) {
      console.error("Error fetching event:", eventError);
      return null;
    }

    if (!eventData || eventData.length === 0) {
      console.log("Event not found for ID:", id);
      return null;
    }

    const event = eventData[0] as EventResponse;
    console.log("Event found:", event);
    
    // Always use consistent image URL
    event.image_url = processImageUrl(event.image_url, event.id);

    const { data: ticketTypes, error: ticketError } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", id);

    if (ticketError) {
      console.error("Error fetching ticket types:", ticketError);
      return null;
    }

    const mappedEvent = mapEventResponse(event, (ticketTypes || []) as TicketTypeResponse[]);
    
    if (ticketTypes && ticketTypes.length > 0) {
      mappedEvent.tickets = ticketTypes.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: Number(ticket.price),
        description: ticket.description || "",
        availableQuantity: Number(ticket.available_quantity),
        maxPerPurchase: Number(ticket.max_per_purchase)
      }));
    }
    
    return mappedEvent;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

/**
 * Fetch user tickets
 */
export const fetchUserTickets = async () => {
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(`
      id,
      qr_code,
      is_used,
      events!inner(id, title, date, location),
      ticket_types!inner(name)
    `)
    .order("id", { ascending: false });

  if (error) throw error;

  return tickets.map(ticket => ({
    id: ticket.id,
    event_id: ticket.events.id,
    event_title: ticket.events.title,
    event_date: format(new Date(ticket.events.date), "dd/MM/yyyy"),
    event_location: ticket.events.location,
    ticket_type: ticket.ticket_types.name,
    qr_code: ticket.qr_code,
    is_used: ticket.is_used
  }));
};
