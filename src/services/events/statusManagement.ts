
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the status of an event (active, paused, cancelled)
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
