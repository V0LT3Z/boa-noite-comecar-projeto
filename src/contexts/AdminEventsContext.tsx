import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from "react";
import { EventItem, EventStatus } from "@/types/admin";
import { fetchEvents, fetchEventById, updateEventStatus, deleteEvent } from "@/services/events";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getDeletedEventIds, addDeletedEventId } from "@/services/utils/deletedEventsUtils";

type AdminEventsContextType = {
  events: EventItem[];
  filteredEvents: EventItem[];
  loadingEvents: boolean;
  searchQuery: string;
  selectedEvent: EventItem | null;
  isCreatingEvent: boolean;
  isProcessingAction: boolean;
  isDeleting: boolean;
  confirmDialogOpen: boolean;
  deleteDialogOpen: boolean;
  actionType: "pause" | "cancel" | "activate";
  editingEvent: EventItem | null;
  deletedEventIds: Set<number>;
  setSearchQuery: (query: string) => void;
  setSelectedEvent: (event: EventItem | null) => void;
  setIsCreatingEvent: (isCreating: boolean) => void;
  setEditingEvent: (event: EventItem | null) => void;
  setConfirmDialogOpen: (isOpen: boolean) => void;
  setDeleteDialogOpen: (isOpen: boolean) => void;
  loadEvents: (forceRefresh?: boolean) => Promise<void>;
  handleStatusChange: (eventId: number, newStatus: EventStatus) => Promise<void>;
  handleDelete: (event: EventItem) => void;
  confirmDelete: () => Promise<void>;
  openConfirmDialog: (event: EventItem, action: "pause" | "cancel" | "activate") => void;
  handleEdit: (event: EventItem) => Promise<void>;
  handleFormBack: () => void;
  handleNewEvent: () => void;
  handleFormSuccess: () => void;
};

const AdminEventsContext = createContext<AdminEventsContextType | undefined>(undefined);

export const AdminEventsProvider = ({ children }: { children: ReactNode }) => {
  // Component state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Dialog state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");
  
  // Processing state
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs to prevent state updates during unmount
  const isMountedRef = useRef(true);
  const apiCallInProgressRef = useRef(false);
  const deletedEventIdsRef = useRef<Set<number>>(new Set());

  // Use state to track deleted events for child components to access
  const [deletedEventIds, setDeletedEventIds] = useState<Set<number>>(new Set());

  // Filter events based on search query and deleted status
  const filteredEvents = events.filter(event => {
    // Don't show events that were deleted
    if (deletedEventIdsRef.current.has(event.id)) {
      return false;
    }
    return event.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Ensure component is mounted before updating state
  useEffect(() => {
    isMountedRef.current = true;
    
    // Load any previously deleted event IDs from localStorage
    try {
      const loadedDeletedIds = getDeletedEventIds();
      if (loadedDeletedIds.size > 0) {
        console.log(`Carregados ${loadedDeletedIds.size} IDs de eventos excluídos do localStorage no AdminEventsContext`);
        deletedEventIdsRef.current = loadedDeletedIds;
        setDeletedEventIds(loadedDeletedIds);
      }
    } catch (error) {
      console.error("Erro ao carregar IDs excluídos do localStorage:", error);
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load events with useCallback to prevent unnecessary re-renders
  const loadEvents = useCallback(async (forceRefresh = false) => {
    // Skip if we're already loading or unmounted
    if (apiCallInProgressRef.current || !isMountedRef.current) return;
    
    try {
      console.log(`Iniciando carregamento de eventos ${forceRefresh ? "(com atualização forçada de cache)" : ""}`);
      apiCallInProgressRef.current = true;
      setLoadingEvents(true);
      
      // Fetch events from the API - using forceRefresh parameter
      const fetchedEvents = await fetchEvents(forceRefresh);
      
      // Skip state update if component unmounted during fetch
      if (!isMountedRef.current) return;
      
      console.log(`${fetchedEvents?.length || 0} eventos carregados do banco de dados`);
      
      // Filter out any events that were marked as deleted
      const filteredEvents = fetchedEvents.filter(
        event => !deletedEventIdsRef.current.has(event.id)
      );
      
      // Format events for display
      const formattedEvents: EventItem[] = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "yyyy-MM-dd"),
        status: (event.status as "active" | "paused" | "cancelled") || "active",
        ticketsSold: event.tickets_sold || 0,
        totalRevenue: 0,
        description: event.description || "",
        location: event.location || "",
        venue: event.location || "",
        minimumAge: event.minimum_age?.toString() || "0"
      }));
      
      setEvents(formattedEvents);
      console.log(`${formattedEvents.length} eventos carregados com sucesso`);
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Skip state update if component unmounted
      if (isMountedRef.current) {
        setLoadingEvents(false);
      }
      apiCallInProgressRef.current = false;
    }
  }, []);

  // Handle event status changes with improved error handling
  const handleStatusChange = async (eventId: number, newStatus: EventStatus) => {
    if (apiCallInProgressRef.current) {
      console.log("Uma operação já está em andamento, ignorando...");
      return;
    }
    
    try {
      apiCallInProgressRef.current = true;
      setIsProcessingAction(true);
      console.log(`Alterando status do evento ${eventId} para ${newStatus}`);
      
      // Update status in the API
      await updateEventStatus(eventId, newStatus);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Update local state optimistically for responsive UI
      setEvents(currentEvents => 
        currentEvents.map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
      
      const action = 
        newStatus === "active" ? "ativado" : 
        newStatus === "paused" ? "pausado" : "cancelado";
      
      toast({
        title: `Evento ${action}`,
        description: `O evento foi ${action} com sucesso.`,
        variant: "success"
      });
      
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error(`Erro ao ${newStatus} evento:`, error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Reset state only if still mounted
      if (isMountedRef.current) {
        setIsProcessingAction(false);
        setConfirmDialogOpen(false);
        
        // Use timeout to ensure dialog is fully closed before resetting selection
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedEvent(null);
          }
        }, 300);
      }
      apiCallInProgressRef.current = false;
    }
  };

  // Handle event deletion with improved permanent removal
  const handleDelete = (event: EventItem) => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of an event
  const confirmDelete = async () => {
    if (!selectedEvent || apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      console.log(`Removendo evento ${selectedEvent.id} permanentemente`);
      
      // Permanently deleting the event from the database
      const result = await deleteEvent(selectedEvent.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Add to deleted events set for immediate UI filtering
      deletedEventIdsRef.current.add(selectedEvent.id);
      
      // Update state for child components
      setDeletedEventIds(new Set(deletedEventIdsRef.current));
      
      // IMPORTANTE: Adicionar ao localStorage usando a função utilitária
      addDeletedEventId(selectedEvent.id);
      
      // Update UI immediately by removing the deleted event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
      
      toast({
        title: "Evento removido",
        description: "O evento foi permanentemente removido do sistema.",
        variant: "success"
      });

      // Force reload events after a short delay to ensure database is synced
      setTimeout(() => {
        if (isMountedRef.current) {
          loadEvents(true); // Force refresh to ensure deleted events don't reappear
        }
      }, 1000);
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao remover evento:", error);
      toast({
        title: "Erro ao remover evento",
        description: "Não foi possível remover o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Reset state only if still mounted
      if (isMountedRef.current) {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        
        // Use timeout to ensure dialog is fully closed before resetting selection
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedEvent(null);
          }
        }, 300);
      }
      apiCallInProgressRef.current = false;
    }
  };

  // Open confirm dialog for status changes
  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  // Handle editing an event
  const handleEdit = async (event: EventItem) => {
    if (apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      console.log(`Carregando detalhes do evento ${event.id} para edição`);
      
      const eventDetails = await fetchEventById(event.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      if (eventDetails) {
        setEditingEvent({
          ...event,
          description: eventDetails.description || "",
          location: eventDetails.location || "",
          venue: eventDetails.venue?.name || "",
          minimumAge: eventDetails.minimumAge?.toString() || "0",
        });
        setIsCreatingEvent(true);
      } else {
        toast({
          title: "Erro ao editar evento",
          description: "Não foi possível carregar os detalhes do evento.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao buscar dados para edição:", error);
      toast({
        title: "Erro ao editar evento",
        description: "Não foi possível carregar os detalhes do evento.",
        variant: "destructive"
      });
    } finally {
      apiCallInProgressRef.current = false;
    }
  };

  // Navigation and form handlers
  const handleFormBack = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsCreatingEvent(true);
  };
  
  const handleFormSuccess = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
    loadEvents();
  };
  
  return (
    <AdminEventsContext.Provider value={{
      events,
      filteredEvents,
      loadingEvents,
      searchQuery,
      selectedEvent,
      isCreatingEvent,
      isProcessingAction,
      isDeleting,
      confirmDialogOpen,
      deleteDialogOpen,
      actionType,
      editingEvent,
      deletedEventIds,
      setSearchQuery,
      setSelectedEvent,
      setIsCreatingEvent,
      setEditingEvent,
      setConfirmDialogOpen,
      setDeleteDialogOpen,
      loadEvents,
      handleStatusChange,
      handleDelete,
      confirmDelete,
      openConfirmDialog,
      handleEdit,
      handleFormBack,
      handleNewEvent,
      handleFormSuccess
    }}>
      {children}
    </AdminEventsContext.Provider>
  );
};

export const useAdminEvents = () => {
  const context = useContext(AdminEventsContext);
  if (context === undefined) {
    throw new Error("useAdminEvents must be used within an AdminEventsProvider");
  }
  return context;
};

// Export for destructuring
export const { Provider: AdminEventsContextProvider } = AdminEventsContext;
