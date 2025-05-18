
import { supabase } from "@/integrations/supabase/client";
import { AdminEventForm } from "@/types/admin";
import { parse } from "date-fns";

/**
 * Creates a new event with ticket types
 */
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

/**
 * Updates an existing event and its ticket types
 */
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

    return { id };
  } catch (error) {
    console.error("Erro geral ao atualizar evento:", error);
    throw error;
  }
};
