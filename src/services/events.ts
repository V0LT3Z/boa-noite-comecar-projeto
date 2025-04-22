import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse, EventDetails } from "@/types/event";
import { AdminEventForm, AdminTicketType } from "@/types/admin";
import { format, parse } from "date-fns";

// Função para converter dados do Supabase para o formato da aplicação
const mapEventResponse = (event: EventResponse, ticketTypes: TicketTypeResponse[] = []): EventDetails => {
  // Extrair data e hora do timestamp
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
    image: event.image_url || "https://picsum.photos/seed/event/800/500", // Imagem padrão se não houver
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
    warnings: [],  // Warnings serão implementados em uma fase posterior
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

// Função para buscar eventos
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

// Função para buscar um evento específico
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

    // Verificar se retornou algum evento
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
      // Ainda podemos retornar o evento mesmo sem ingressos
    }

    return mapEventResponse(event, (ticketTypes || []) as TicketTypeResponse[]);
  } catch (error) {
    console.error("Erro geral ao buscar evento:", error);
    return null;
  }
};

// Função para criar um evento
export const createEvent = async (eventData: AdminEventForm, userId?: string) => {
  try {
    console.log("Criando novo evento:", eventData);
    // Combinar data e hora em um único timestamp
    const dateTime = `${eventData.date}T${eventData.time || "19:00"}`;
    const dateObj = parse(dateTime, "yyyy-MM-dd'T'HH:mm", new Date());

    // Verificar se temos o ID do usuário
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      userId = user.id;
    }
    
    console.log("Criando evento para o usuário com ID:", userId);

    // Calcular total de tickets
    const totalTickets = eventData.tickets.reduce(
      (sum, ticket) => sum + (parseInt(ticket.availableQuantity) || 0),
      0
    );

    // Preparar dados do evento
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

    // Inserir o evento principal
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

    // Inserir os tipos de ingressos
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

// Função para atualizar um evento
export const updateEvent = async (id: number, eventData: AdminEventForm) => {
  // Combinar data e hora em um único timestamp
  const dateTime = `${format(eventData.date, "yyyy-MM-dd")}T${eventData.time}`;
  const dateObj = parse(dateTime, "yyyy-MM-dd'T'HH:mm", new Date());

  // Atualizar o evento principal
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
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (eventError) throw eventError;

  // Buscar os tipos de ingressos existentes
  const { data: existingTickets } = await supabase
    .from("ticket_types")
    .select("id")
    .eq("event_id", id);

  const existingIds = existingTickets?.map(ticket => ticket.id) || [];

  // Processar os tipos de ingressos (atualizar/inserir/excluir)
  for (const ticket of eventData.tickets) {
    const ticketData = {
      event_id: id,
      name: ticket.name,
      price: parseFloat(ticket.price) || 0,
      description: ticket.description,
      available_quantity: parseInt(ticket.availableQuantity) || 0,
      max_per_purchase: parseInt(ticket.maxPerPurchase) || 4
    };

    // Se o ingresso tem um ID numérico, é uma atualização
    if (!isNaN(parseInt(ticket.id))) {
      const ticketId = parseInt(ticket.id);
      const { error } = await supabase
        .from("ticket_types")
        .update(ticketData)
        .eq("id", ticketId);

      if (error) throw error;
      
      // Remover este ID da lista de existingIds
      const index = existingIds.indexOf(ticketId);
      if (index > -1) {
        existingIds.splice(index, 1);
      }
    } else {
      // Caso contrário, é uma inserção
      const { error } = await supabase
        .from("ticket_types")
        .insert(ticketData);

      if (error) throw error;
    }
  }

  // Excluir tipos de ingressos que não estão mais presentes
  if (existingIds.length > 0) {
    const { error } = await supabase
      .from("ticket_types")
      .delete()
      .in("id", existingIds);

    if (error) throw error;
  }

  return { id };
};

// Função para atualizar o status de um evento
export const updateEventStatus = async (id: number, status: "active" | "paused" | "cancelled") => {
  const { error } = await supabase
    .from("events")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  return { id, status };
};

// Função para buscar os ingressos de um usuário
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
