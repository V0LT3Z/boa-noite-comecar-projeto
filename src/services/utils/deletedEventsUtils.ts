
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
        return new Set(parsedIds.map(id => Number(id)));
      }
    }
    return new Set();
  } catch (error) {
    console.error("Erro ao carregar IDs excluídos do localStorage:", error);
    return new Set();
  }
};

/**
 * Add an event ID to the deleted events set
 */
export const addDeletedEventId = (eventId: number): void => {
  try {
    const deletedIds = getDeletedEventIds();
    deletedIds.add(Number(eventId));
    localStorage.setItem('deleted_event_ids', JSON.stringify([...deletedIds]));
    console.log(`ID ${eventId} adicionado à lista de eventos excluídos`);
  } catch (error) {
    console.error("Erro ao salvar ID excluído no localStorage:", error);
  }
};

/**
 * Check if an event ID is in the deleted set
 */
export const isEventDeleted = (eventId: number): boolean => {
  const deletedIds = getDeletedEventIds();
  const result = deletedIds.has(Number(eventId));
  
  // Debug log to help troubleshoot
  console.log(`Verificando se evento ${eventId} está excluído: ${result} (total excluídos: ${deletedIds.size})`);
  
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
