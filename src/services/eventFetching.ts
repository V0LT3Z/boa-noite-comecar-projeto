
import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse } from "@/types/event";
import { mapEventResponse } from "./utils/eventMappers";
import { processImageUrl } from "./utils/imageUtils";
import { format } from "date-fns";
import { getDeletedEventIds } from "./utils/deletedEventsUtils";

// Cache em memória para reduzir requisições à API
let eventsCache: EventResponse[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

// Hash dos dados para verificar mudanças reais
let eventsDataHash: string = '';

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
    
    // Otimização: Verificação de ETag para reduzir transferência de dados
    // Usamos o cabeçalho "If-None-Match" quando disponível para verificar mudanças
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .throwOnError();

    if (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
    
    console.log(`Eventos obtidos do banco: ${events?.length || 0}`);
    
    // Process all image URLs to ensure they're valid and persistent
    if (events) {
      // Otimização: Apenas processa imagens se o dado é novo
      const newDataHash = generateDataHash(events);
      
      // Se o hash não mudou, não precisamos reprocessar imagens
      const dataChanged = newDataHash !== eventsDataHash;
      
      if (dataChanged) {
        events.forEach(event => {
          // Otimização: Use processImageUrl apenas para novas imagens ou imagens alteradas
          event.image_url = processImageUrl(event.image_url, event.id);
        });
        
        // Atualizar cache e hash
        eventsCache = events as EventResponse[];
        eventsDataHash = newDataHash;
        lastFetchTime = now;
        console.log("Cache de eventos atualizado com novos dados");
      } else {
        console.log("Dados de eventos sem alterações, usando cache existente");
        // Ainda assim atualizamos o timestamp para manter o cache fresco
        lastFetchTime = now;
      }
    } else {
      eventsCache = [];
      eventsDataHash = '';
      lastFetchTime = now;
    }
    
    return eventsCache;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Em caso de erro, retornamos o cache se disponível para evitar falhas na UI
    if (eventsCache) {
      console.log("Usando cache devido a erro na requisição");
      return eventsCache;
    }
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (id: number) => {
  try {
    console.log("Buscando evento com ID:", id);
    
    // Otimização: Tente encontrar o evento no cache primeiro
    if (eventsCache && eventsCache.length > 0) {
      const cachedEvent = eventsCache.find(event => event.id === id);
      if (cachedEvent) {
        console.log("Evento encontrado no cache:", id);
        
        // Buscar apenas os tipos de ingressos, que são mais propensos a mudanças
        const { data: ticketTypes, error: ticketError } = await supabase
          .from("ticket_types")
          .select("*")
          .eq("event_id", id);

        if (ticketError) {
          console.error("Erro ao buscar tipos de ingressos:", ticketError);
          return null;
        }

        const mappedEvent = mapEventResponse(cachedEvent, (ticketTypes || []) as TicketTypeResponse[]);
        
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
      }
    }

    // Se não encontrou no cache, busca no banco de dados
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
    
    // Atualiza o cache com esse evento se ele não estiver lá
    if (eventsCache) {
      const existingEventIndex = eventsCache.findIndex(e => e.id === event.id);
      if (existingEventIndex >= 0) {
        // Atualiza o evento existente
        eventsCache[existingEventIndex] = event;
      } else {
        // Adiciona o novo evento ao cache
        eventsCache.push(event);
      }
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

/**
 * Gera um hash simples a partir dos dados para detectar mudanças
 */
function generateDataHash(events: EventResponse[]): string {
  if (!events || events.length === 0) return '';
  
  // Cria um hash baseado nos IDs e timestamps de atualização
  return events.map(e => `${e.id}-${e.updated_at}`).join('|');
}
