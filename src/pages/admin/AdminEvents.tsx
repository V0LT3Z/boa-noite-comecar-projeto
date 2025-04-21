import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, ArrowLeft, Search, MoreHorizontal, PauseCircle, Play, X, Edit
} from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

// Type definition for EventStatus
type EventStatus = "active" | "paused" | "cancelled";

// Define the EventItem interface
interface EventItem {
  id: number;
  title: string;
  date: string;
  status: EventStatus;
  ticketsSold: number;
  totalRevenue: number;
}

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

  const renderStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pausado</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: pt });
    } catch {
      return dateString;
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
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar eventos..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {filteredEvents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome do Evento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ingressos Vendidos</TableHead>
                        <TableHead className="text-right">Receita (R$)</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{formatDate(event.date)}</TableCell>
                          <TableCell>{renderStatusBadge(event.status)}</TableCell>
                          <TableCell className="text-right">{event.ticketsSold}</TableCell>
                          <TableCell className="text-right">
                            {event.totalRevenue.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(event)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {event.status === "active" && (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog(event, "pause")}
                                    className="text-amber-600"
                                  >
                                    <PauseCircle className="h-4 w-4 mr-2" />
                                    Pausar
                                  </DropdownMenuItem>
                                )}
                                {event.status === "paused" && (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog(event, "activate")}
                                    className="text-green-600"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                {(event.status === "active" || event.status === "paused") && (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog(event, "cancel")}
                                    className="text-destructive"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum evento encontrado</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleNewEvent}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Criar primeiro evento
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "pause" ? "Pausar evento" : 
               actionType === "cancel" ? "Cancelar evento" : "Ativar evento"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "pause" && "Isso irá pausar as vendas de ingressos para este evento. Você poderá reativá-lo a qualquer momento."}
              {actionType === "cancel" && "Isso irá cancelar o evento e todas as vendas em andamento. Esta ação não pode ser desfeita."}
              {actionType === "activate" && "Isso irá ativar o evento e permitir que as vendas de ingressos continuem."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedEvent) {
                  const newStatus = 
                    actionType === "pause" ? "paused" : 
                    actionType === "cancel" ? "cancelled" : "active";
                  handleStatusChange(selectedEvent.id, newStatus as EventStatus);
                }
              }}
              className={
                actionType === "cancel" ? "bg-destructive hover:bg-destructive/90" :
                actionType === "activate" ? "bg-green-600 hover:bg-green-700" :
                "bg-amber-500 hover:bg-amber-600"
              }
            >
              {actionType === "pause" ? "Pausar" : 
               actionType === "cancel" ? "Cancelar" : "Ativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminEvents;
