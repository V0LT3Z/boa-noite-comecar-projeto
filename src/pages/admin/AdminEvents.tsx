
import { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, RotateCcw } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { 
  fetchEvents, 
  fetchEventById, 
  updateEventStatus, 
  updateEvent, 
  deleteEvent,
  markEventAsLocallyDeleted,
  restoreLocallyDeletedEvent,
  getLocallyDeletedEvents
} from "@/services/events";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const AdminEvents = () => {
  // Component state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [deletedEvents, setDeletedEvents] = useState<number[]>([]);
  
  // Dialog state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");
  
  // Processing state
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Refs to prevent state updates during unmount
  const isMountedRef = useRef(true);
  const apiCallInProgressRef = useRef(false);

  // Reset mounted ref on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Atualiza a lista de IDs de eventos excluídos do localStorage
  const updateDeletedEventsFromStorage = useCallback(() => {
    const deletedIds = getLocallyDeletedEvents();
    setDeletedEvents(deletedIds);
    return deletedIds;
  }, []);

  // Load events with useCallback to prevent unnecessary re-renders
  const loadEvents = useCallback(async () => {
    // Skip if we're already loading or unmounted
    if (apiCallInProgressRef.current || !isMountedRef.current) return;
    
    try {
      console.log("Iniciando carregamento de eventos");
      apiCallInProgressRef.current = true;
      setLoadingEvents(true);
      
      // Fetch events from the API - incluindo os marcados como excluídos!
      const fetchedEvents = await fetchEvents();
      
      // Skip state update if component unmounted during fetch
      if (!isMountedRef.current) return;
      
      // Atualizar lista de eventos excluídos do localStorage
      updateDeletedEventsFromStorage();
      
      console.log(`Eventos carregados: ${fetchedEvents.length}`);
      
      // Format events for display
      const formattedEvents: EventItem[] = fetchedEvents.map(event => ({
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
  }, [updateDeletedEventsFromStorage]);

  // Load events on mount and when event creation state changes
  useEffect(() => {
    if (!isCreatingEvent) {
      loadEvents();
    }
  }, [isCreatingEvent, loadEvents]);

  // Filter events based on search query and deleted status
  const filteredEvents = events.filter(event => {
    // Um evento está excluído se estiver na lista de excluídos
    const isDeleted = deletedEvents.includes(event.id);
    
    // Filtrar por termo de busca
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Na tela de admin, mostramos os eventos excluídos com um badge
    return matchesSearch;
  });

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

  // Handle event deletion - NOW USING markEventAsLocallyDeleted
  const handleDelete = (event: EventItem) => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setDeleteDialogOpen(true);
  };
  
  // Handle event restoration
  const handleRestore = (event: EventItem) => {
    // Create a deep copy to prevent mutations
    setSelectedEvent(JSON.parse(JSON.stringify(event)));
    setRestoreDialogOpen(true);
  };

  // Confirm deletion of an event - NOW USING markEventAsLocallyDeleted
  const confirmDelete = async () => {
    if (!selectedEvent || apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsDeleting(true);
      console.log(`Marcando evento ${selectedEvent.id} como excluído localmente`);
      
      // Agora apenas marcamos como excluído localmente
      markEventAsLocallyDeleted(selectedEvent.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      // Atualiza a lista de IDs excluídos
      const updatedDeletedIds = updateDeletedEventsFromStorage();
      console.log("Lista atualizada de IDs excluídos:", updatedDeletedIds);
      
      toast({
        title: "Evento removido",
        description: "O evento foi marcado como removido e não aparecerá na página inicial.",
        variant: "success"
      });
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao marcar evento como excluído:", error);
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
  
  // Confirm restoration of an event
  const confirmRestore = async () => {
    if (!selectedEvent || apiCallInProgressRef.current) return;
    
    try {
      apiCallInProgressRef.current = true;
      setIsRestoring(true);
      console.log(`Restaurando evento ${selectedEvent.id}`);
      
      // Restaurar evento usando a função centralizada
      const success = restoreLocallyDeletedEvent(selectedEvent.id);
      
      // Skip state updates if component unmounted
      if (!isMountedRef.current) return;
      
      if (success) {
        // Atualiza a lista de IDs excluídos
        const updatedDeletedIds = updateDeletedEventsFromStorage();
        console.log("Lista atualizada de IDs excluídos após restauração:", updatedDeletedIds);
        
        toast({
          title: "Evento restaurado",
          description: "O evento foi restaurado e voltará a aparecer na página inicial.",
          variant: "success"
        });
      } else {
        toast({
          title: "Erro ao restaurar evento",
          description: "Não foi possível restaurar o evento. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Skip error handling if component unmounted
      if (!isMountedRef.current) return;
      
      console.error("Erro ao restaurar evento:", error);
      toast({
        title: "Erro ao restaurar evento",
        description: "Não foi possível restaurar o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Reset state only if still mounted
      if (isMountedRef.current) {
        setIsRestoring(false);
        setRestoreDialogOpen(false);
        
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

  // Close all dialogs and reset state on unmount
  useEffect(() => {
    return () => {
      setSelectedEvent(null);
      setConfirmDialogOpen(false);
      setDeleteDialogOpen(false);
      setRestoreDialogOpen(false);
      setIsProcessingAction(false);
      setIsDeleting(false);
      setIsRestoring(false);
    };
  }, []);

  // Renderizar badge de status "Excluído localmente" para eventos excluídos
  const renderEventStatus = (event: EventItem) => {
    const isDeleted = deletedEvents.includes(event.id);
    
    if (isDeleted) {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
            Excluído
          </span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(event);
            }}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Restaurar
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {isCreatingEvent ? (
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={handleFormBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                {editingEvent ? `Editar Evento: ${editingEvent.title}` : "Criar Novo Evento"}
              </h1>
            </div>
            <EventForm event={editingEvent} onSuccess={handleFormSuccess} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
              <div className="flex gap-3">
                <Button onClick={handleNewEvent}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Evento
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg">
              <EventSearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery}
                events={events}
                autoFocus={true}
              />
              
              {loadingEvents ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Carregando eventos...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                <EventsTable 
                  events={filteredEvents} 
                  onEdit={handleEdit}
                  onStatusAction={openConfirmDialog}
                  onDeleteEvent={handleDelete}
                  renderExtraStatus={renderEventStatus}
                  deletedEventIds={deletedEvents}
                />
              ) : (
                <EmptyEventsList onCreateEvent={handleNewEvent} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Status change confirmation dialog */}
      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          if (!isProcessingAction && isMountedRef.current) {
            setConfirmDialogOpen(open);
            if (!open) {
              // Clear state after dialog closes
              setTimeout(() => {
                if (isMountedRef.current) {
                  setSelectedEvent(null);
                }
              }, 300);
            }
          }
        }}
        selectedEvent={selectedEvent}
        actionType={actionType}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
        disabled={isProcessingAction}
      />

      {/* Delete event confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!isDeleting && isMountedRef.current) {
          setDeleteDialogOpen(open);
          if (!open) {
            // Clear state after dialog closes
            setTimeout(() => {
              if (isMountedRef.current) {
                setSelectedEvent(null);
              }
            }, 300);
          }
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja esconder o evento <span className="font-semibold">{selectedEvent?.title}</span>? 
              Ele não aparecerá mais na página inicial, mas poderá ser restaurado depois.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDeleting && isMountedRef.current) {
                  setDeleteDialogOpen(false);
                }
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore event confirmation dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={(open) => {
        if (!isRestoring && isMountedRef.current) {
          setRestoreDialogOpen(open);
          if (!open) {
            // Clear state after dialog closes
            setTimeout(() => {
              if (isMountedRef.current) {
                setSelectedEvent(null);
              }
            }, 300);
          }
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar restauração</DialogTitle>
            <DialogDescription>
              Deseja restaurar o evento <span className="font-semibold">{selectedEvent?.title}</span>? 
              Ele voltará a aparecer na página inicial.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isRestoring && isMountedRef.current) {
                  setRestoreDialogOpen(false);
                }
              }}
              disabled={isRestoring}
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmRestore();
              }}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? "Restaurando..." : "Restaurar evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
