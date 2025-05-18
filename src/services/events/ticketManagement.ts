
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a specific ticket type
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
