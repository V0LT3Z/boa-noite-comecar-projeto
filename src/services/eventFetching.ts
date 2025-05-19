
import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse } from "@/types/event";
import { mapEventResponse } from "./utils/eventMappers";
import { processImageUrl } from "./utils/imageUtils";
import { format } from "date-fns";
import { getDeletedEventIds } from "./utils/deletedEventsUtils";

// Cache em memória para reduzir requisições à API
let eventsCache: EventResponse[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos em milissegundos

/**
 * Fetch all events from the database
 */
export const fetchEvents = async (forceRefresh = false) => {
  try {
    const now = Date.now();
    const cacheIsValid = eventsCache !== null && (now - lastFetchTime) < CACHE_TTL;
    
    // Se temos cache válido e não estamos forçando atualização, use o cache
    if (cacheIsValid && !forceRefresh) {
      console.log("Usando eventos em cache");
      return eventsCache;
    }
    
    console.log("Buscando todos os eventos", forceRefresh ? "(forçando atualização do cache)" : "");
    
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .throwOnError();

    if (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
    
    console.log(`Eventos encontrados: ${events?.length || 0}`);
    
    // Process all image URLs to ensure they're valid and persistent
    if (events) {
      events.forEach(event => {
        event.image_url = processImageUrl(event.image_url, event.id);
      });
      
      // Atualizar cache
      eventsCache = events as EventResponse[];
      lastFetchTime = now;
    }
    
    return events as EventResponse[];
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (id: number) => {
  try {
    console.log("Buscando evento com ID:", id);
    
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id);

    if (eventError) {
      console.error("Erro ao buscar evento:", eventError);
      return null;
    }

    if (!eventData || eventData.length === 0) {
      console.log("Evento não encontrado para o ID:", id);
      return null;
    }

    const event = eventData[0] as EventResponse;
    console.log("Evento encontrado:", event);
    
    // Always use consistent image URL
    event.image_url = processImageUrl(event.image_url, event.id);

    const { data: ticketTypes, error: ticketError } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", id);

    if (ticketError) {
      console.error("Erro ao buscar tipos de ingressos:", ticketError);
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
    console.error("Erro geral ao buscar evento:", error);
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
