import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

/**
 * Delete a ticket type from the database
 */
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

/**
 * Delete an event and all its related data
 */
export const deleteEvent = async (id: number) => {
  try {
    console.log(`Iniciando exclusão permanente do evento com ID: ${id}`);
    
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
      
      // Delete tickets associated with these ticket types
      const { error: ticketsError } = await supabase
        .from("tickets")
        .delete()
        .in("ticket_type_id", ticketTypeIds);
        
      if (ticketsError) {
        console.error("Erro ao excluir ingressos associados:", ticketsError);
      }
      
      // Delete orders associated with these ticket types
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .in("ticket_type_id", ticketTypeIds);
        
      if (ordersError) {
        console.error("Erro ao excluir pedidos associados:", ordersError);
      }
      
      // Delete ticket types
      const { error: deleteTicketTypesError } = await supabase
        .from("ticket_types")
        .delete()
        .eq("event_id", id);
        
      if (deleteTicketTypesError) {
        console.error("Erro ao excluir tipos de ingressos:", deleteTicketTypesError);
      }
    }
    
    // Delete any favorites associated with this event
    const { error: favoritesError } = await supabase
      .from("favorites")
      .delete()
      .eq("event_id", id);
      
    if (favoritesError) {
      console.error("Erro ao excluir favoritos associados:", favoritesError);
    }
    
    // Delete notifications associated with this event
    const { error: notificationsError } = await supabase
      .from("notifications")
      .delete()
      .eq("event_id", id);
      
    if (notificationsError) {
      console.error("Erro ao excluir notificações associadas:", notificationsError);
    }
    
    // Delete any orders directly linked to the event
    const { error: eventOrdersError } = await supabase
      .from("orders")
      .delete()
      .eq("event_id", id);
      
    if (eventOrdersError) {
      console.error("Erro ao excluir pedidos diretamente ligados ao evento:", eventOrdersError);
    }
    
    // Delete any tickets directly linked to the event
    const { error: eventTicketsError } = await supabase
      .from("tickets")
      .delete()
      .eq("event_id", id);
      
    if (eventTicketsError) {
      console.error("Erro ao excluir ingressos diretamente ligados ao evento:", eventTicketsError);
    }
    
    // For better robustness, use a two-step approach:
    // 1. First mark the event as deleted in the database
    const { error: updateError } = await supabase
      .from("events")
      .update({ status: "deleted" })
      .eq("id", id);
      
    if (updateError) {
      console.error("Erro ao marcar evento como excluído:", updateError);
      throw updateError;
    }
    
    // 2. Then also add it to localStorage for immediate UI updates
    const { addDeletedEventId } = await import('./utils/deletedEventsUtils');
    addDeletedEventId(id);

    console.log("Evento marcado como excluído com sucesso. ID:", id);
    return { success: true, id };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    throw error;
  }
};
