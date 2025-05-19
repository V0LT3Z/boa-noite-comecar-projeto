import { supabase } from "@/integrations/supabase/client";
import { EventResponse, TicketTypeResponse, EventDetails } from "@/types/event";
import { AdminEventForm, AdminTicketType } from "@/types/admin";
import { format, parse } from "date-fns";

// Helper function to generate consistent image URLs based on event ID
const generatePersistentImageUrl = (eventId: number) => {
  return `https://picsum.photos/seed/${eventId}/800/500`;
};

// Helper function to process image URLs - ensures blob URLs are converted to persistent ones
const processImageUrl = (imageUrl: string | null | undefined, eventId: number) => {
  // Always use a persistent URL based on event ID for consistency
  return generatePersistentImageUrl(eventId);
};

const mapEventResponse = (event: EventResponse, ticketTypes: TicketTypeResponse[] = []): EventDetails => {
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "yyyy-MM-dd");
  const formattedTime = format(eventDate, "HH:mm");

  // Always use deterministic image URL
  const processedImageUrl = processImageUrl(event.image_url, event.id);

  return {
    id: event.id,
    title: event.title,
    date: formattedDate,
    time: formattedTime,
    location: event.location,
    description: event.description || "",
    image: processedImageUrl,
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
    
    // Process all image URLs to ensure they're persistent
    if (events) {
      events.forEach(event => {
        event.image_url = processImageUrl(event.image_url, event.id);
      });
    }
    
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
    
    // Let's create the event first to get an ID
    const totalTickets = eventData.tickets.reduce(
      (sum, ticket) => sum + (parseInt(String(ticket.availableQuantity)) || 0),
      0
    );

    const eventInsertData = {
      title: eventData.title,
      description: eventData.description,
      date: dateObj.toISOString(),
      location: eventData.location,
      image_url: null, // We'll update this after getting an ID
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
    
    // Now update with the persistent image URL based on the event ID
    let persistentImageUrl = processImageUrl(eventData.bannerUrl, eventInsert.id);
    
    console.log("URL da imagem persistente sendo armazenada:", persistentImageUrl);
    
    // Update the event with the permanent image URL
    const { error: updateError } = await supabase
      .from("events")
      .update({ image_url: persistentImageUrl })
      .eq("id", eventInsert.id);
      
    if (updateError) {
      console.error("Erro ao atualizar URL da imagem:", updateError);
      // Continue anyway - this is not critical
    }

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
    
    return { ...eventInsert, image_url: persistentImageUrl };
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

    // Always use consistent image URL based on event ID
    const processedImageUrl = processImageUrl(eventData.bannerUrl, id);
    console.log("URL de imagem processada para atualização:", processedImageUrl);

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
        image_url: processedImageUrl,
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

    // After updating the event, we fetch it again to confirm the image URL was saved correctly
    const { data: updatedEvent } = await supabase
      .from("events")
      .select("image_url")
      .eq("id", id)
      .single();
      
    if (updatedEvent) {
      console.log("Evento atualizado com sucesso. URL da imagem salva:", updatedEvent.image_url);
    }

    const { data: existingTickets, error: fetchError } = await supabase
      .from("ticket_types")
      .select("*")
      .eq("event_id", id);

    if (fetchError) {
      console.error("Erro ao buscar tipos de ingressos existentes:", fetchError);
      throw fetchError;
    }

    for (const ticket of eventData.tickets) {
      const ticketData = {
        event_id: id,
        name: ticket.name,
        price: parseFloat(String(ticket.price)) || 0,
        description: ticket.description,
        available_quantity: parseInt(String(ticket.availableQuantity)) || 0,
        max_per_purchase: parseInt(String(ticket.maxPerPurchase)) || 4
      };
      
      if (ticket.id && typeof ticket.id === 'number') {
        const { error: updateError } = await supabase
          .from("ticket_types")
          .update(ticketData)
          .eq("id", ticket.id);
        
        if (updateError) {
          console.error(`Erro ao atualizar ingresso ${ticket.id}:`, updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("ticket_types")
          .insert(ticketData);
        
        if (insertError) {
          console.error("Erro ao inserir novo tipo de ingresso:", insertError);
          throw insertError;
        }
      }
    }
    
    const ticketIdsInForm = eventData.tickets
      .map(t => typeof t.id === 'number' ? t.id : null)
      .filter(id => id !== null);
    
    const ticketsToDelete = existingTickets?.filter(
      ticket => !ticketIdsInForm.includes(ticket.id)
    );
    
    if (ticketsToDelete && ticketsToDelete.length > 0) {
      const idsToDelete = ticketsToDelete.map(ticket => ticket.id);
      const { error: deleteError } = await supabase
        .from("ticket_types")
        .delete()
        .in("id", idsToDelete);
      
      if (deleteError) {
        console.error("Erro ao excluir tipos de ingressos obsoletos:", deleteError);
        throw deleteError;
      }
    }

    return { id, image_url: processedImageUrl };
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

export const deleteTicketType = async (ticketTypeId: number) => {
  try {
    console.log(`Excluindo tipo de ingresso com ID: ${ticketTypeId}`);
    
    const { error } = await supabase
      .from("ticket_types")
      .delete()
      .eq("id", ticketTypeId);
    
    if (error) {
      console.error("Erro ao excluir tipo de ingresso:", error);
      throw error;
    }
    
    console.log("Tipo de ingresso excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao excluir tipo de ingresso:", error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    console.log(`Excluindo evento com ID: ${id}`);
    
    // First, get all the ticket_types associated with this event
    const { data: ticketTypes, error: ticketTypesError } = await supabase
      .from("ticket_types")
      .select("id")
      .eq("event_id", id);

    if (ticketTypesError) {
      console.error("Erro ao buscar tipos de ingressos:", ticketTypesError);
      // Continue with deletion anyway
    }
    
    // If there are ticket types, we need to handle associated tickets and orders
    if (ticketTypes && ticketTypes.length > 0) {
      const ticketTypeIds = ticketTypes.map(tt => tt.id);
      
      // Delete tickets associated with these ticket types (if any)
      const { error: ticketsError } = await supabase
        .from("tickets")
        .delete()
        .in("ticket_type_id", ticketTypeIds);
        
      if (ticketsError) {
        console.error("Erro ao excluir ingressos associados:", ticketsError);
        // Continue with deletion anyway
      }
      
      // Delete orders associated with these ticket types (if any)
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .in("ticket_type_id", ticketTypeIds);
        
      if (ordersError) {
        console.error("Erro ao excluir pedidos associados:", ordersError);
        // Continue with deletion anyway
      }
      
      // Delete ticket types
      const { error: deleteTicketTypesError } = await supabase
        .from("ticket_types")
        .delete()
        .eq("event_id", id);
        
      if (deleteTicketTypesError) {
        console.error("Erro ao excluir tipos de ingressos:", deleteTicketTypesError);
        // Continue with deletion anyway
      }
    }
    
    // Also delete any favorites associated with this event
    const { error: favoritesError } = await supabase
      .from("favorites")
      .delete()
      .eq("event_id", id);
      
    if (favoritesError) {
      console.error("Erro ao excluir favoritos associados:", favoritesError);
      // Continue with deletion anyway
    }
    
    // Delete notifications associated with this event
    const { error: notificationsError } = await supabase
      .from("notifications")
      .delete()
      .eq("event_id", id);
      
    if (notificationsError) {
      console.error("Erro ao excluir notificações associadas:", notificationsError);
      // Continue with deletion anyway
    }
    
    // Finally, delete the event itself
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir evento:", error);
      throw error;
    }

    console.log("Evento excluído com sucesso");
    return { success: true, id };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    throw error;
  }
};
