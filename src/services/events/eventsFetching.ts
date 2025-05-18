
import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse, EventDetails } from "@/types/event";
import { format } from "date-fns";

/**
 * Maps event response data to EventDetails format
 */
export const mapEventResponse = (event: EventResponse, ticketTypes: TicketTypeResponse[] = []): EventDetails => {
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "yyyy-MM-dd");
  const formattedTime = format(eventDate, "HH:mm");

  return {
    id: event.id,
    title: event.title,
    date: formattedDate,
    time: formattedTime,
    location: event.location,
    description: event.description || "",
    image: event.image_url || "https://picsum.photos/seed/event/800/500",
    minimumAge: event.minimum_age || 0,
    status: (event.status as "active" | "paused" | "cancelled") || "active",
    tickets: ticketTypes.map(tt => ({
      id: tt.id,
      name: tt.name,
      price: tt.price,
      description: tt.description || undefined,
      availableQuantity: tt.available_quantity,
      maxPerPurchase: tt.max_per_purchase
    })),
    warnings: [],
    venue: {
      name: event.location,
      address: event.location,
      capacity: event.total_tickets,
      map_url: ""
    },
    coordinates: {
      lat: -23.550520,
      lng: -46.633308
    }
  };
};

/**
 * Fetches all events from the database
 */
export const fetchEvents = async () => {
  try {
    console.log("Buscando todos os eventos");
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
    
    // Garantir que só retornamos eventos válidos
    const validEvents = events?.filter(event => event && typeof event.id === 'number') || [];
    
    console.log(`Eventos encontrados: ${validEvents.length || 0}`);
    return validEvents as EventResponse[];
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

/**
 * Fetches a single event by ID with its ticket types
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
