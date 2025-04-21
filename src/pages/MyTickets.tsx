
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { UserTicket } from "@/types/event"
import { fetchUserTickets } from "@/services/events"
import { toast } from "@/hooks/use-toast"
import QRCode from "react-qr-code"

const MyTickets = () => {
  const { user } = useAuth()
  const { isLoading } = useProtectedRoute()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  
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
  
  if (isLoading || isLoadingTickets) {
    return <div className="p-6">Carregando...</div>
  }

  const handleShowQR = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
  };
  
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="p-4">
        <Link to="/minha-conta">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="px-4">
        <Tabs defaultValue="ingressos" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-dashboard-card rounded-xl h-12 p-1">
            <TabsTrigger 
              value="ingressos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Ingressos
            </TabsTrigger>
            <TabsTrigger 
              value="produtos"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Produtos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingressos" className="mt-4">
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`bg-dashboard-card border ${ticket.is_used ? 'border-gray-300 opacity-70' : 'border-gray-200'} p-4`}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-primary/20 rounded-lg flex items-center justify-center">
                        {selectedTicket?.id === ticket.id ? (
                          <div className="p-2 bg-white rounded">
                            <QRCode value={ticket.qr_code} size={80} />
                          </div>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleShowQR(ticket)}
                            className="text-xs"
                          >
                            Ver QR Code
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{ticket.event_title}</h3>
                        <p className="text-dashboard-muted">{ticket.event_location}</p>
                        <p className="text-sm text-dashboard-muted">{ticket.event_date}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {ticket.ticket_type}
                          </span>
                          {ticket.is_used && (
                            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                              Utilizado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedTicket?.id === ticket.id && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-center mb-2">
                          <QRCode value={ticket.qr_code} />
                        </div>
                        <p className="text-center font-mono text-sm mt-2">{ticket.qr_code}</p>
                        <p className="text-center text-xs text-gray-500 mt-1">
                          Apresente este QR Code na entrada do evento
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dashboard-muted">
                Você ainda não possui ingressos
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="produtos">
            <div className="text-center py-8 text-dashboard-muted">
              Nenhum produto disponível
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTickets
