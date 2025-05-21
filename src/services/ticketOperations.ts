
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { addDeletedEventId } from "./utils/deletedEventsUtils";

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
 * Enhanced version with better guarantees that the event stays deleted
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
      } else {
        console.log(`Excluídos ingressos associados aos tipos: ${ticketTypeIds.join(', ')}`);
      }
      
      // Delete orders associated with these ticket types
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .in("ticket_type_id", ticketTypeIds);
        
      if (ordersError) {
        console.error("Erro ao excluir pedidos associados:", ordersError);
      } else {
        console.log(`Excluídos pedidos associados aos tipos: ${ticketTypeIds.join(', ')}`);
      }
      
      // Delete ticket types
      const { error: deleteTicketTypesError } = await supabase
        .from("ticket_types")
        .delete()
        .eq("event_id", id);
        
      if (deleteTicketTypesError) {
        console.error("Erro ao excluir tipos de ingressos:", deleteTicketTypesError);
      } else {
        console.log(`Excluídos ${ticketTypes.length} tipos de ingressos do evento ${id}`);
      }
    }
    
    // Delete any favorites associated with this event
    const { error: favoritesError } = await supabase
      .from("favorites")
      .delete()
      .eq("event_id", id);
      
    if (favoritesError) {
      console.error("Erro ao excluir favoritos associados:", favoritesError);
    } else {
      console.log(`Excluídos favoritos associados ao evento ${id}`);
    }
    
    // Delete notifications associated with this event
    const { error: notificationsError } = await supabase
      .from("notifications")
      .delete()
      .eq("event_id", id);
      
    if (notificationsError) {
      console.error("Erro ao excluir notificações associadas:", notificationsError);
    } else {
      console.log(`Excluídas notificações associadas ao evento ${id}`);
    }
    
    // Delete any orders directly linked to the event
    const { error: eventOrdersError } = await supabase
      .from("orders")
      .delete()
      .eq("event_id", id);
      
    if (eventOrdersError) {
      console.error("Erro ao excluir pedidos diretamente ligados ao evento:", eventOrdersError);
    } else {
      console.log(`Excluídos pedidos diretamente ligados ao evento ${id}`);
    }
    
    // Delete any tickets directly linked to the event
    const { error: eventTicketsError } = await supabase
      .from("tickets")
      .delete()
      .eq("event_id", id);
      
    if (eventTicketsError) {
      console.error("Erro ao excluir ingressos diretamente ligados ao evento:", eventTicketsError);
    } else {
      console.log(`Excluídos ingressos diretamente ligados ao evento ${id}`);
    }
    
    // Mark the event as deleted with double confirmation
    const { error: updateError } = await supabase
      .from("events")
      .update({ 
        status: "deleted",
        updated_at: new Date().toISOString(),
        title: `[DELETADO] ${id} - ${new Date().toISOString()}` // Add deletion marker in the title as well
      })
      .eq("id", id);
      
    if (updateError) {
      console.error("Erro ao marcar evento como excluído:", updateError);
      throw updateError;
    }
    
    console.log(`Evento ${id} marcado como 'deleted' no banco de dados com sucesso`);
    
    // Add it to localStorage for immediate UI updates
    addDeletedEventId(id);

    console.log("Evento marcado como excluído com sucesso e adicionado ao localStorage. ID:", id);
    return { success: true, id };
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    // Still add to local storage even on error
    addDeletedEventId(id);
    throw error;
  }
};
