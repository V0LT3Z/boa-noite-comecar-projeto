
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { toast } from "@/hooks/use-toast";
import { EventItem, EventStatus } from "@/types/admin";
import { EventsTable } from "@/components/admin/events/EventsTable";
import { ConfirmActionDialog } from "@/components/admin/events/ConfirmActionDialog";
import { EventSearchBar } from "@/components/admin/events/EventSearchBar";
import { EmptyEventsList } from "@/components/admin/events/EmptyEventsList";

// Mock data for demonstration with proper typing
const mockEvents: EventItem[] = [
  {
    id: 1,
    title: "Festival de Verão 2025",
    date: "2025-01-15",
    status: "active",
    ticketsSold: 342,
    totalRevenue: 17100,
  },
  {
    id: 2,
    title: "Show do Radiohead",
    date: "2025-03-10",
    status: "paused",
    ticketsSold: 128,
    totalRevenue: 12800,
  },
  {
    id: 3,
    title: "Feira Gastronômica",
    date: "2025-02-05",
    status: "cancelled",
    ticketsSold: 0,
    totalRevenue: 0,
  },
];

const AdminEvents = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"pause" | "cancel" | "activate">("pause");

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (eventId: number, newStatus: EventStatus) => {
    setEvents(currentEvents => 
      currentEvents.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
    
    // Close dialog after action
    setConfirmDialogOpen(false);
    setSelectedEvent(null);
    
    // Show success notification
    const action = 
      newStatus === "active" ? "ativado" : 
      newStatus === "paused" ? "pausado" : "cancelado";
    
    toast({
      title: `Evento ${action}`,
      description: `O evento foi ${action} com sucesso.`,
    });
  };

  const openConfirmDialog = (event: EventItem, action: "pause" | "cancel" | "activate") => {
    setSelectedEvent(event);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsCreatingEvent(true);
  };

  const handleFormBack = () => {
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsCreatingEvent(true);
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
            <EventForm event={editingEvent} onSuccess={handleFormBack} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
              <Button onClick={handleNewEvent}>
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
            
            <div className="border rounded-lg">
              <EventSearchBar 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
              />
              
              {filteredEvents.length > 0 ? (
                <EventsTable 
                  events={filteredEvents} 
                  onEdit={handleEdit}
                  onStatusAction={openConfirmDialog}
                />
              ) : (
                <EmptyEventsList onCreateEvent={handleNewEvent} />
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmActionDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        selectedEvent={selectedEvent}
        actionType={actionType}
        onConfirm={(event, newStatus) => handleStatusChange(event.id, newStatus)}
      />
    </AdminLayout>
  );
};

export default AdminEvents;
