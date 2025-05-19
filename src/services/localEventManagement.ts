
/**
 * Local event deletion management
 * Handles local storage of deleted event IDs to hide events from the UI
 * without actually deleting them from the database
 */

// Key for storing deleted event IDs in localStorage
const DELETED_EVENTS_KEY = 'deletedEventIds';

/**
 * Verifies if an event is marked as locally deleted
 * @param eventId ID of the event to check
 * @returns true if the event is locally deleted, false otherwise
 */
export const isEventLocallyDeleted = (eventId: number): boolean => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return false;
    
    const deletedEventIds = JSON.parse(savedIds);
    return Array.isArray(deletedEventIds) && deletedEventIds.includes(eventId);
  } catch (error) {
    console.error('Erro ao verificar se evento está excluído:', error);
    return false;
  }
}

/**
 * Marks an event as locally deleted
 * @param eventId ID of the event to mark as deleted
 */
export const markEventAsLocallyDeleted = (eventId: number): void => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    const deletedEventIds = savedIds ? JSON.parse(savedIds) : [];
    
    if (!Array.isArray(deletedEventIds)) {
      // If not an array, initialize a new one
      localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify([eventId]));
      console.log(`Evento ${eventId} marcado como excluído localmente (nova lista criada)`);
      return;
    }
    
    if (!deletedEventIds.includes(eventId)) {
      deletedEventIds.push(eventId);
      localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(deletedEventIds));
      console.log(`Evento ${eventId} marcado como excluído localmente. Lista atual:`, deletedEventIds);
    }
  } catch (error) {
    console.error('Erro ao marcar evento como excluído:', error);
  }
}

/**
 * Restores a locally deleted event
 * @param eventId ID of the event to restore
 * @returns true if successful, false otherwise
 */
export const restoreLocallyDeletedEvent = (eventId: number): boolean => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return false;
    
    let deletedEventIds: number[];
    try {
      deletedEventIds = JSON.parse(savedIds);
      if (!Array.isArray(deletedEventIds)) {
        localStorage.removeItem(DELETED_EVENTS_KEY);
        return false;
      }
    } catch (e) {
      localStorage.removeItem(DELETED_EVENTS_KEY);
      return false;
    }
    
    const updatedIds = deletedEventIds.filter(id => id !== eventId);
    
    if (updatedIds.length === deletedEventIds.length) {
      // Event wasn't in the list
      return false;
    }
    
    localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(updatedIds));
    console.log(`Evento ${eventId} restaurado (removido da lista de excluídos localmente). Lista atual:`, updatedIds);
    return true;
  } catch (error) {
    console.error('Erro ao restaurar evento:', error);
    return false;
  }
}

/**
 * Clears the locally deleted events list
 */
export const clearLocallyDeletedEvents = (): void => {
  try {
    localStorage.removeItem(DELETED_EVENTS_KEY);
    console.log("Lista de eventos excluídos localmente foi limpa");
  } catch (error) {
    console.error('Erro ao limpar lista de eventos excluídos:', error);
  }
}

/**
 * Gets the list of locally deleted event IDs
 * @returns Array of deleted event IDs
 */
export const getLocallyDeletedEvents = (): number[] => {
  try {
    const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
    if (!savedIds) return [];
    
    const ids = JSON.parse(savedIds);
    return Array.isArray(ids) ? ids : [];
  } catch (error) {
    console.error('Erro ao obter lista de eventos excluídos:', error);
    localStorage.removeItem(DELETED_EVENTS_KEY); // Remove invalid data
    return [];
  }
}
