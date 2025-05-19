
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
        // Log para depuração
        console.log(`Carregados ${parsedIds.length} IDs de eventos excluídos: ${parsedIds.join(', ')}`);
        return new Set(parsedIds);
      }
    }
    console.log('Nenhum ID de evento excluído encontrado no localStorage');
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
    deletedIds.add(eventId);
    const idsArray = [...deletedIds];
    localStorage.setItem('deleted_event_ids', JSON.stringify(idsArray));
    console.log(`Evento ID ${eventId} marcado como excluído. Total: ${idsArray.length} IDs salvos.`);
  } catch (error) {
    console.error("Erro ao salvar ID excluído no localStorage:", error);
  }
};

/**
 * Check if an event ID is in the deleted set
 */
export const isEventDeleted = (eventId: number): boolean => {
  const isDeleted = getDeletedEventIds().has(eventId);
  if (isDeleted) {
    console.log(`Evento ID ${eventId} está marcado como excluído.`);
  }
  return isDeleted;
};

/**
 * Clear all deleted event IDs (útil para testes)
 */
export const clearDeletedEventIds = (): void => {
  try {
    localStorage.removeItem('deleted_event_ids');
    console.log('Todos os IDs de eventos excluídos foram removidos do localStorage');
  } catch (error) {
    console.error("Erro ao limpar IDs excluídos do localStorage:", error);
  }
};

