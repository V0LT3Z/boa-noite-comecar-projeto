
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
    
    // Forçar a atualização imediata no cache do navegador para impedir a reaparição
    try {
      // Limpar qualquer cache que possa estar mantendo este evento
      localStorage.setItem('force_refresh_events', Date.now().toString());
      
      // Também tentar limpar caches do React Query se existirem
      const queryCache = localStorage.getItem('tanstack-query-cache');
      if (queryCache) {
        try {
          const parsedCache = JSON.parse(queryCache);
          localStorage.setItem('tanstack-query-cache-backup', queryCache);
          localStorage.removeItem('tanstack-query-cache');
          console.log("Cache do React Query limpo para forçar nova busca de eventos");
        } catch (e) {
          console.error("Erro ao manipular cache do React Query:", e);
        }
      }
    } catch (e) {
      console.error("Erro ao forçar atualização de cache:", e);
    }
  } catch (error) {
    console.error("Erro ao salvar ID excluído no localStorage:", error);
  }
};

/**
 * Check if an event ID is in the deleted set
 * VERSÃO MELHORADA: Mais agressiva na detecção de eventos excluídos
 */
export const isEventDeleted = (eventId: number): boolean => {
  try {
    // Forçar conversão para número
    const numericId = Number(eventId);
    
    // Verificar no localStorage
    const deletedIds = getDeletedEventIds();
    const isDeleted = deletedIds.has(numericId);
    
    if (isDeleted) {
      console.log(`Evento ${numericId} está marcado como excluído no localStorage`);
      return true;
    }
    
    // Verificação adicional para títulos que começam com [DELETADO]
    // Isso ajuda a identificar eventos que foram marcados como excluídos no banco de dados
    try {
      const eventCache = localStorage.getItem(`event_${numericId}_title`);
      if (eventCache && eventCache.includes("[DELETADO]")) {
        console.log(`Evento ${numericId} tem título marcado como excluído no cache: ${eventCache}`);
        // Adiciona ao localStorage para futuras verificações
        addDeletedEventId(numericId);
        return true;
      }
    } catch (e) {
      // Ignorar erros de cache, continuar com as verificações
    }
    
    // Verificação extra em ultimas instâncias de dados
    if (window && window.localStorage) {
      try {
        const allStorage = { ...localStorage };
        const keysWithEventId = Object.keys(allStorage).filter(key => 
          key.includes(`event_${numericId}`) || key.includes(`deleted`) || key.includes(`events`)
        );
        
        for (const key of keysWithEventId) {
          const value = allStorage[key];
          if (value && (
            value.includes(`"id":${numericId},"status":"deleted"`) || 
            value.includes(`"id":${numericId},"title":"[DELETADO]`)
          )) {
            console.log(`Evento ${numericId} encontrado como excluído em cache alternativo: ${key}`);
            addDeletedEventId(numericId);
            return true;
          }
        }
      } catch (e) {
        // Ignorar erros de busca profunda em cache
      }
    }
    
    return false;
  } catch (error) {
    console.error("Erro ao verificar se evento está excluído:", error);
    return false;
  }
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
      .select("id,title,status")
      .or('status.eq.deleted,title.like.[DELETADO]%');
    
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
        // Armazenar o título para verificação futura
        if (event.title) {
          localStorage.setItem(`event_${event.id}_title`, event.title);
        }
        
        deletedIds.add(Number(event.id));
        console.log(`Evento ${event.id} marcado como excluído da sincronização DB: status=${event.status}, title=${event.title}`);
      });
      
      // Save back to localStorage
      const deletedIdsArray = Array.from(deletedIds);
      localStorage.setItem('deleted_event_ids', JSON.stringify(deletedIdsArray));
      
      console.log(`Sincronizados ${data.length} eventos excluídos do banco de dados. Total: ${deletedIds.size} (antes: ${beforeCount})`, deletedIdsArray);
      
      // Forçar a atualização do cache para garantir que mudanças sejam aplicadas
      localStorage.setItem('force_refresh_events', Date.now().toString());
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
    try {
      localStorage.setItem(`event_${eventId}_status`, "deleted");
      localStorage.setItem(`event_${eventId}_title`, `[DELETADO] ${eventId} - ${new Date().toISOString()}`);
      
      // Tentar atualizar em caches conhecidos
      const cachedEvents = localStorage.getItem('tanstack-query-cache');
      if (cachedEvents) {
        console.log(`Tentando atualizar status do evento ${eventId} no cache local`);
      }
    } catch (e) {
      console.error("Erro ao atualizar cache local:", e);
    }
  } catch (error) {
    console.error("Erro ao marcar evento como excluído localmente:", error);
  }
};
