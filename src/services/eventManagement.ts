
import { supabase } from "@/integrations/supabase/client";
import { AdminEventForm } from "@/types/admin";
import { parse } from "date-fns";
import { processImageUrl } from "./utils/imageUtils";

/**
 * Create a new event in the database
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

/**
 * Update an existing event in the database
 */
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

/**
 * Update the status of an event
 */
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
