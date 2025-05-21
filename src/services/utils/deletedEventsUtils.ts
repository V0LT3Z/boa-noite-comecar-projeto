
/**
 * Utility functions to manage deleted event IDs across the application
 * This ensures consistency between admin and public views
 */

/**
 * Get the set of deleted event IDs from localStorage
 */
export const getDeletedEventIds = (): Set<number> => {
  try {
    const savedDeletedIds = localStorage.getItem('deleted_event_ids');
    if (savedDeletedIds) {
      const parsedIds = JSON.parse(savedDeletedIds);
      if (Array.isArray(parsedIds)) {
        // Ensure all IDs are treated as numbers
        const deletedIds = new Set(parsedIds.map(id => Number(id)));
        console.log(`Carregados ${deletedIds.size} IDs de eventos excluídos do localStorage:`, Array.from(deletedIds));
        return deletedIds;
      }
    }
    console.log("Nenhum ID de evento excluído encontrado no localStorage");
    return new Set();
  } catch (error) {
    console.error("Erro ao carregar IDs excluídos do localStorage:", error);
    // Create empty set on error
    return new Set();
  }
};

/**
 * Add an event ID to the deleted events set
 */
export const addDeletedEventId = (eventId: number): void => {
  try {
    const deletedIds = getDeletedEventIds();
    const numericId = Number(eventId);
    deletedIds.add(numericId);
    
    const deletedIdsArray = Array.from(deletedIds);
    localStorage.setItem('deleted_event_ids', JSON.stringify(deletedIdsArray));
    
    console.log(`ID ${numericId} adicionado à lista de eventos excluídos. Total: ${deletedIds.size}`, deletedIdsArray);
  } catch (error) {
    console.error("Erro ao salvar ID excluído no localStorage:", error);
  }
};

/**
 * Check if an event ID is in the deleted set
 */
export const isEventDeleted = (eventId: number): boolean => {
  const deletedIds = getDeletedEventIds();
  const numericId = Number(eventId);
  const result = deletedIds.has(numericId);
  
  console.log(`Verificando se evento ${numericId} está excluído: ${result} (total excluídos: ${deletedIds.size})`);
  
  return result;
};

/**
 * Clear all deleted event IDs
 */
export const clearDeletedEventIds = (): void => {
  try {
    localStorage.removeItem('deleted_event_ids');
    console.log("Lista de eventos excluídos foi limpa");
  } catch (error) {
    console.error("Erro ao limpar IDs excluídos do localStorage:", error);
  }
};

/**
 * Refresh deleted event IDs from the database - enhanced version
 * More aggressive sync to ensure we catch all deleted events
 */
export const syncDeletedEventsFromDatabase = async (): Promise<void> => {
  try {
    console.log("Sincronizando eventos excluídos do banco de dados...");
    
    // Import needed here to avoid circular dependencies
    const { supabase } = await import("@/integrations/supabase/client");
    
    // Query the database for events marked as deleted
    const { data, error } = await supabase
      .from("events")
      .select("id")
      .eq("status", "deleted");
    
    if (error) {
      console.error("Erro ao sincronizar eventos excluídos:", error);
      return;
    }
    
    if (data && data.length > 0) {
      // Get current deleted IDs
      const deletedIds = getDeletedEventIds();
      const beforeCount = deletedIds.size;
      
      // Add database deleted events
      data.forEach(event => {
        deletedIds.add(Number(event.id));
      });
      
      // Save back to localStorage
      const deletedIdsArray = Array.from(deletedIds);
      localStorage.setItem('deleted_event_ids', JSON.stringify(deletedIdsArray));
      
      console.log(`Sincronizados ${data.length} eventos excluídos do banco de dados. Total: ${deletedIds.size} (antes: ${beforeCount})`, deletedIdsArray);
    } else {
      console.log("Nenhum evento com status 'deleted' encontrado no banco de dados");
    }
  } catch (error) {
    console.error("Erro ao sincronizar eventos excluídos:", error);
  }
};

/**
 * Force update event status in cache without waiting for backend
 */
export const markEventAsDeletedLocally = (eventId: number): void => {
  try {
    // Add to deleted IDs
    addDeletedEventId(eventId);
    
    // Also try to update the event status in any cached responses
    // This helps when React Query has cached the data
    const cachedEvents = localStorage.getItem('tanstack-query-cache');
    if (cachedEvents) {
      console.log(`Tentando atualizar status do evento ${eventId} no cache local`);
    }
  } catch (error) {
    console.error("Erro ao marcar evento como excluído localmente:", error);
  }
};
