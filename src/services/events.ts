import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse, EventDetails } from "@/types/event";
import { AdminEventForm, AdminTicketType } from "@/types/admin";
import { format, parse } from "date-fns";

const mapEventResponse = (event: EventResponse, ticketTypes: TicketTypeResponse[] = []): EventDetails => {
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
    
    console.log(`Eventos encontrados: ${events?.length || 0}`);
    return events as EventResponse[];
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

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

export const createEvent = async (eventData: AdminEventForm, userId?: string) => {
  try {
    console.log("Criando novo evento:", eventData);
    const dateTime = `${eventData.date}T${eventData.time || "19:00"}`;
    const dateObj = parse(dateTime, "yyyy-MM-dd'T'HH:mm", new Date());

    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      userId = user.id;
    }
    
    console.log("Criando evento para o usuário com ID:", userId);

    const totalTickets = eventData.tickets.reduce(
      (sum, ticket) => sum + (parseInt(String(ticket.availableQuantity)) || 0),
      0
    );

    const eventInsertData = {
      title: eventData.title,
      description: eventData.description,
      date: dateObj.toISOString(),
      location: eventData.location,
      image_url: eventData.bannerUrl || null,
      minimum_age: parseInt(eventData.minimumAge) || 0,
      status: eventData.status || "active",
      total_tickets: totalTickets,
      user_id: userId
    };
    
    console.log("Dados do evento para inserção:", eventInsertData);

    const { data: eventInsert, error: eventError } = await supabase
      .from("events")
      .insert(eventInsertData)
      .select()
      .single();

    if (eventError) {
      console.error("Erro ao criar evento:", eventError);
      throw eventError;
    }

    console.log("Evento criado com sucesso:", eventInsert);

    if (eventInsert && eventData.tickets && eventData.tickets.length > 0) {
      const ticketTypesData = eventData.tickets.map(ticket => ({
        event_id: eventInsert.id,
        name: ticket.name,
        price: parseFloat(ticket.price) || 0,
        description: ticket.description,
        available_quantity: parseInt(ticket.availableQuantity) || 0,
        max_per_purchase: parseInt(ticket.maxPerPurchase) || 4
      }));

      console.log("Inserindo tipos de ingresso:", ticketTypesData);

      const { error: ticketError } = await supabase
        .from("ticket_types")
        .insert(ticketTypesData);

      if (ticketError) {
        console.error("Erro ao criar tipos de ingresso:", ticketError);
        throw ticketError;
      }

      console.log("Tipos de ingresso criados com sucesso");
    }
    
    return eventInsert;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }
};

export const updateEvent = async (id: number, eventData: AdminEventForm) => {
  try {
    console.log("Atualizando evento:", id, eventData);
    const dateTime = `${eventData.date}T${eventData.time || "19:00"}`;
    const dateObj = parse(dateTime, "yyyy-MM-dd'T'HH:mm", new Date());

    const totalTickets = eventData.tickets.reduce(
      (sum, ticket) => sum + (parseInt(String(ticket.availableQuantity)) || 0),
      0
    );

    const { error: eventError } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description,
        date: dateObj.toISOString(),
        location: eventData.location,
        image_url: eventData.bannerUrl,
        minimum_age: parseInt(eventData.minimumAge) || 0,
        status: eventData.status,
        total_tickets: totalTickets,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (eventError) {
      console.error("Erro ao atualizar evento:", eventError);
      throw eventError;
    }

    const { error: deleteError } = await supabase
      .from("ticket_types")
      .delete()
      .eq("event_id", id);

    if (deleteError) {
      console.error("Erro ao excluir tipos de ingressos existentes:", deleteError);
      throw deleteError;
    }

    if (eventData.tickets.length > 0) {
      const ticketsToInsert = eventData.tickets.map(ticket => ({
        event_id: id,
        name: ticket.name,
        price: parseFloat(String(ticket.price)) || 0,
        description: ticket.description,
        available_quantity: parseInt(String(ticket.availableQuantity)) || 0,
        max_per_purchase: parseInt(String(ticket.maxPerPurchase)) || 4
      }));

      const { error: insertError } = await supabase
        .from("ticket_types")
        .insert(ticketsToInsert);

      if (insertError) {
        console.error("Erro ao inserir novos tipos de ingresso:", insertError);
        throw insertError;
      }
    }

    return { id };
  } catch (error) {
    console.error("Erro geral ao atualizar evento:", error);
    throw error;
  }
};

export const updateEventStatus = async (id: number, status: "active" | "paused" | "cancelled") => {
  try {
    console.log(`Alterando status do evento ${id} para ${status}`);
    
    const { data, error } = await supabase
      .from("events")
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Erro ao atualizar status do evento:", error);
      throw error;
    }

    console.log("Status atualizado com sucesso:", data);
    return { id, status };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
};

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
