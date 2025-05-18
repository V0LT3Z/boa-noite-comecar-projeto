
import { supabase } from "@/integrations/supabase/client";

/**
 * Completely deletes an event and all associated records
 */
export const deleteEvent = async (id: number) => {
  try {
    console.log(`Excluindo evento com ID: ${id}`);
    
    if (!id || isNaN(id)) {
      throw new Error("ID de evento inválido");
    }
    
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
