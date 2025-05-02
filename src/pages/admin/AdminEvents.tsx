
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";
import { fetchEvents, fetchEventById, updateEventStatus, updateEvent, deleteEvent } from "@/services/events";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const AdminEvents = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const fetchedEvents = await fetchEvents();
      
      const formattedEvents: EventItem[] = fetchedEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "yyyy-MM-dd"),
        status: (event.status as "active" | "paused" | "cancelled") || "active",
        ticketsSold: event.tickets_sold || 0,
        totalRevenue: 0,
        description: event.description || "",
        location: event.location || "",
        venue: event.location || "", // Using location as venue if not specified
        minimumAge: event.minimum_age?.toString() || "0"
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar a lista de eventos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (!isCreatingEvent) {
      loadEvents();
    }
  }, [isCreatingEvent]);

  const filteredEvents = events.filter(event => {
    // Filter by search query
    return event.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleStatusChange = async (eventId: number, newStatus: EventStatus) => {
    try {
      setIsProcessingAction(true);
      await updateEventStatus(eventId, newStatus);
      
      // Atualiza o estado local imediatamente para feedback visual rápido
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
      
      // Recarregar eventos do servidor para garantir dados atualizados
      await loadEvents();
    } catch (error) {
      console.error(`Erro ao ${newStatus} evento:`, error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      // Garantir que todos os estados sejam limpos adequadamente, independente de sucesso ou erro
      setIsProcessingAction(false);
      setConfirmDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDelete = async (event: EventItem) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsDeleting(true);
      await deleteEvent(selectedEvent.id);
      
      toast({
        title: "Evento removido",
        description: "O evento foi removido com sucesso.",
        variant: "success"
      });
      
      // Atualizar a lista de eventos após a exclusão
      await loadEvents();
    } catch (error) {
      console.error("Erro ao remover evento:", error);
      toast({
        title: "Erro ao remover evento",
        description: "Não foi possível remover o evento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    setSelectedEvent(event);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleEdit = async (event: EventItem) => {
    try {
      const eventDetails = await fetchEventById(event.id);
      if (eventDetails) {
        // Make sure we're preserving all required fields from both sources
        setEditingEvent({
          ...event,
          description: eventDetails.description || "",
          location: eventDetails.location || "",
          venue: eventDetails.venue?.name || "",
          minimumAge: eventDetails.minimumAge?.toString() || "0",
          // Add any other fields needed for editing
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
      console.error("Erro ao buscar dados para edição:", error);
      toast({
        title: "Erro ao editar evento",
        description: "Não foi possível carregar os detalhes do evento.",
        variant: "destructive"
      });
    }
  };

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
          // Não permitir fechar o diálogo durante o processamento da ação
          if (!isProcessingAction) {
            setConfirmDialogOpen(open);
            // Se estiver fechando o diálogo manualmente, limpe também o evento selecionado
            if (!open) {
              setSelectedEvent(null);
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
        if (!isDeleting) {
          setDeleteDialogOpen(open);
          if (!open) {
            setSelectedEvent(null);
          }
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Tem certeza que deseja remover permanentemente o evento <span className="font-semibold">{selectedEvent?.title}</span>? Esta ação não pode ser desfeita.
          </DialogDescription>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removendo..." : "Remover evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
