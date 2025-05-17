
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { ArrowLeft, Ticket, Calendar, MapPin, Gift, X } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { UserTicket } from "@/types/event"
import { fetchUserTickets } from "@/services/events"
import { toast } from "@/hooks/use-toast"
import QRCode from "react-qr-code"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const MyTickets = () => {
  const { user } = useAuth()
  const { isLoading } = useProtectedRoute()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  
  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const userTickets = await fetchUserTickets();
      setTickets(userTickets);
    } catch (error) {
      console.error("Erro ao carregar ingressos:", error);
      toast({
        title: "Erro ao carregar ingressos",
        description: "Não foi possível buscar seus ingressos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleShowQR = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setQrModalOpen(true);
  };

  const closeModal = () => {
    setQrModalOpen(false);
  };
  
  if (isLoading || isLoadingTickets) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const groupTicketsByEvent = () => {
    const groupedTickets: Record<string, UserTicket[]> = {};
    
    tickets.forEach(ticket => {
      const key = `${ticket.event_id}-${ticket.event_title}`;
      if (!groupedTickets[key]) {
        groupedTickets[key] = [];
      }
      groupedTickets[key].push(ticket);
    });
    
    return Object.entries(groupedTickets).map(([key, tickets]) => ({
      eventId: tickets[0].event_id,
      eventTitle: tickets[0].event_title,
      eventDate: tickets[0].event_date,
      eventLocation: tickets[0].event_location,
      tickets
    }));
  };
  
  const groupedTickets = groupTicketsByEvent();
  const upcomingEvents = groupedTickets.filter(group => 
    new Date(group.tickets[0].event_date) >= new Date()
  );
  
  const pastEvents = groupedTickets.filter(group => 
    new Date(group.tickets[0].event_date) < new Date()
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dashboard-card pb-10">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Improved header with back button integrated */}
        <div className="flex items-center mb-8">
          <Link to="/minha-conta">
            <Button variant="ghost" size="icon" className="mr-4 rounded-full h-10 w-10 bg-white shadow-sm hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Meus Ingressos
            </h1>
            <p className="text-dashboard-muted">
              Gerencie todos os seus ingressos e produtos comprados
            </p>
          </div>
        </div>

        <Tabs defaultValue="ingressos" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-dashboard-card rounded-xl h-12 p-1 mb-6">
            <TabsTrigger 
              value="ingressos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Ticket className="mr-2 h-4 w-4" />
              Ingressos
            </TabsTrigger>
            <TabsTrigger 
              value="produtos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              <Gift className="mr-2 h-4 w-4" />
              Produtos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingressos" className="animate-fade-in">
            {tickets.length > 0 ? (
              <div className="space-y-8">
                {upcomingEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Próximos Eventos</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {upcomingEvents.map((eventGroup) => (
                        <Card key={eventGroup.eventId} className="overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                          <CardHeader className="bg-gradient-primary text-white p-4">
                            <h3 className="text-xl font-bold">{eventGroup.eventTitle}</h3>
                            <div className="flex items-center text-sm opacity-90">
                              <Calendar className="mr-2 h-4 w-4" />
                              {new Date(eventGroup.eventDate).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center text-sm opacity-90">
                              <MapPin className="mr-2 h-4 w-4" />
                              {eventGroup.eventLocation}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="font-medium mb-2">Seus ingressos:</p>
                            <div className="space-y-2">
                              {eventGroup.tickets.map((ticket) => (
                                <div 
                                  key={ticket.id} 
                                  className={`p-3 rounded-lg flex justify-between items-center ${ticket.is_used ? 'bg-gray-100' : 'bg-soft-purple'}`}
                                >
                                  <div>
                                    <p className="font-medium">{ticket.ticket_type}</p>
                                    <p className="text-xs text-dashboard-muted">
                                      Código: {ticket.qr_code.substring(0, 8)}...
                                    </p>
                                  </div>
                                  <Button
                                    onClick={() => handleShowQR(ticket)}
                                    variant="secondary"
                                    size="sm"
                                  >
                                    Ver QR
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Eventos Passados</h2>
                    <Card>
                      <CardContent className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Evento</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">QR Code</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pastEvents.flatMap(group => 
                              group.tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                  <TableCell className="font-medium">{ticket.event_title}</TableCell>
                                  <TableCell>{new Date(ticket.event_date).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>{ticket.ticket_type}</TableCell>
                                  <TableCell>
                                    {ticket.is_used ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Utilizado
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Disponível
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleShowQR(ticket)}
                                    >
                                      Ver QR
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-md animate-fade-in">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Ticket className="h-16 w-16 text-primary/40 mb-6" />
                  <h3 className="text-xl font-bold mb-2">Nenhum ingresso encontrado</h3>
                  <p className="text-center text-dashboard-muted mb-6 max-w-md">
                    Parece que você ainda não adquiriu nenhum ingresso. Explore os eventos disponíveis para encontrar algo do seu interesse!
                  </p>
                  <Button asChild>
                    <Link to="/eventos">Ver eventos disponíveis</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="produtos" className="animate-fade-in">
            <Card className="overflow-hidden bg-white border border-gray-200 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Gift className="h-16 w-16 text-primary/40 mb-6" />
                <h3 className="text-xl font-bold mb-2">Nenhum produto encontrado</h3>
                <p className="text-center text-dashboard-muted mb-6 max-w-md">
                  Você ainda não adquiriu nenhum produto. Fique atento às nossas promoções e produtos exclusivos dos seus eventos favoritos!
                </p>
                <Button asChild>
                  <Link to="/eventos">Ver eventos disponíveis</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg w-full max-w-md relative overflow-hidden animate-scale-in">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 pt-10">
              <h3 className="text-2xl font-bold text-center mb-2">{selectedTicket.event_title}</h3>
              <p className="text-center text-dashboard-muted mb-6">
                {selectedTicket.ticket_type}
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center mb-4">
                <div className="p-3 bg-white rounded-md shadow-sm">
                  <QRCode 
                    value={selectedTicket.qr_code} 
                    size={200}
                    className="mx-auto"
                  />
                </div>
              </div>
              
              <p className="text-center font-mono text-sm mt-2 mb-1 break-all px-4">
                {selectedTicket.qr_code}
              </p>
              
              <p className="text-center text-xs text-dashboard-muted mb-4">
                Apresente este QR Code na entrada do evento
              </p>
              
              <div className="flex justify-between items-center text-sm px-4 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span>{new Date(selectedTicket.event_date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <span>{selectedTicket.event_location}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={closeModal}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyTickets
