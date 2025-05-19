
import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse } from "@/types/event";
import { mapEventResponse } from "./utils/eventMappers";
import { processImageUrl } from "./utils/imageUtils";
import { format } from "date-fns";

// Chave para armazenar IDs de eventos excluídos no localStorage
const DELETED_EVENTS_KEY = 'deletedEventIds';

/**
 * Fetch all events from the database
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
    
    console.log(`Eventos encontrados (total): ${events?.length || 0}`);
    
    // Process all image URLs to ensure they're valid and persistent
    if (events) {
      events.forEach(event => {
        console.log(`Processando imagem para evento ${event.id}, URL original:`, event.image_url);
        event.image_url = processImageUrl(event.image_url, event.id);
        console.log(`URL processada:`, event.image_url);
      });
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
 * Verifica se um evento está excluído localmente
 * @param eventId ID do evento para verificar
 * @returns true se o evento estiver excluído localmente, false caso contrário
 */
export const isEventLocallyDeleted = (eventId: number): boolean => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return false;
    
    const deletedEventIds = JSON.parse(savedIds);
    return Array.isArray(deletedEventIds) && deletedEventIds.includes(eventId);
  } catch (error) {
    console.error('Erro ao verificar se evento está excluído:', error);
    return false;
  }
}

/**
 * Adiciona um evento à lista de excluídos localmente
 * @param eventId ID do evento para marcar como excluído
 */
export const markEventAsLocallyDeleted = (eventId: number): void => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    const deletedEventIds = savedIds ? JSON.parse(savedIds) : [];
    
    if (!Array.isArray(deletedEventIds)) {
      // Se não for um array, inicializa um novo
      localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify([eventId]));
      console.log(`Evento ${eventId} marcado como excluído localmente (nova lista criada)`);
      return;
    }
    
    if (!deletedEventIds.includes(eventId)) {
      deletedEventIds.push(eventId);
      localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(deletedEventIds));
      console.log(`Evento ${eventId} marcado como excluído localmente. Lista atual:`, deletedEventIds);
    }
  } catch (error) {
    console.error('Erro ao marcar evento como excluído:', error);
  }
}

/**
 * Remove um evento da lista de excluídos localmente
 * @param eventId ID do evento para restaurar
 * @returns true se o evento foi restaurado, false caso contrário
 */
export const restoreLocallyDeletedEvent = (eventId: number): boolean => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return false;
    
    let deletedEventIds: number[];
    try {
      deletedEventIds = JSON.parse(savedIds);
      if (!Array.isArray(deletedEventIds)) {
        localStorage.removeItem(DELETED_EVENTS_KEY);
        return false;
      }
    } catch (e) {
      localStorage.removeItem(DELETED_EVENTS_KEY);
      return false;
    }
    
    const updatedIds = deletedEventIds.filter(id => id !== eventId);
    
    if (updatedIds.length === deletedEventIds.length) {
      // Evento não estava na lista
      return false;
    }
    
    localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(updatedIds));
    console.log(`Evento ${eventId} restaurado (removido da lista de excluídos localmente). Lista atual:`, updatedIds);
    return true;
  } catch (error) {
    console.error('Erro ao restaurar evento:', error);
    return false;
  }
}

/**
 * Limpa a lista de eventos excluídos localmente
 */
export const clearLocallyDeletedEvents = (): void => {
  try {
    localStorage.removeItem(DELETED_EVENTS_KEY);
    console.log("Lista de eventos excluídos localmente foi limpa");
  } catch (error) {
    console.error('Erro ao limpar lista de eventos excluídos:', error);
  }
}

/**
 * Retorna a lista de eventos excluídos localmente
 * @returns Array de IDs dos eventos excluídos
 */
export const getLocallyDeletedEvents = (): number[] => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return [];
    
    const ids = JSON.parse(savedIds);
    return Array.isArray(ids) ? ids : [];
  } catch (error) {
    console.error('Erro ao obter lista de eventos excluídos:', error);
    localStorage.removeItem(DELETED_EVENTS_KEY); // Remove invalid data
    return [];
  }
}

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
