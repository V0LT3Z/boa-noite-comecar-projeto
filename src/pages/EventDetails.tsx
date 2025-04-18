import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Info, Clock, MapPin, AlertTriangle, ChevronLeft } from "lucide-react"
import Header from "@/components/Header"
import TicketSelector from "@/components/TicketSelector"
import EventMap from "@/components/EventMap"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EventDetails } from "@/types/event"

const eventDetails: EventDetails = {
  id: 1,
  title: "Festival de Música 2024",
  date: "20 Maio 2024",
  time: "16:00",
  location: "Parque Villa-Lobos, São Paulo, SP",
  coordinates: {
    lat: -23.5464,
    lng: -46.7227
  },
  description: "O maior festival de música do Brasil está de volta! Com mais de 30 atrações distribuídas em 3 palcos, o Festival de Música 2024 promete ser um evento inesquecível. Traga sua família e amigos para curtir o melhor da música nacional e internacional.",
  image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=400&fit=crop",
  minimumAge: 16,
  tickets: [
    {
      id: 1,
      name: "Ingresso Inteira",
      price: 280,
      description: "Ingresso comum, valor integral",
      availableQuantity: 1000,
      maxPerPurchase: 4
    },
    {
      id: 2,
      name: "Ingresso Meia-entrada",
      price: 140,
      description: "Mediante comprovação na entrada do evento",
      availableQuantity: 500,
      maxPerPurchase: 2
    },
    {
      id: 3,
      name: "Ingresso VIP",
      price: 560,
      description: "Área exclusiva com open bar e food",
      availableQuantity: 200,
      maxPerPurchase: 4
    }
  ],
  warnings: [
    "É obrigatória a apresentação de documento com foto para entrada no evento",
    "Proibida a entrada de menores de 16 anos desacompanhados dos pais ou responsáveis legais",
    "A meia-entrada é válida mediante apresentação de documento comprobatório na entrada do evento"
  ]
}

const EventDetailsPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({})
  
  const hasSelectedTickets = Object.values(selectedTickets).some(quantity => quantity > 0)

  const handleGoBack = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="outline"
          className="mb-4 text-primary border-primary hover:bg-primary/10 flex items-center"
          onClick={handleGoBack}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Voltar para página inicial
        </Button>
      </div>
      
      <div className="relative h-[400px] w-full overflow-hidden">
        <img 
          src={eventDetails.image} 
          alt={eventDetails.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">{eventDetails.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span>{eventDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{eventDetails.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Sobre o evento</h2>
              <p className="text-gray-600 leading-relaxed">{eventDetails.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Avisos importantes</h2>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDescription>
                    Idade mínima: {eventDetails.minimumAge} anos
                  </AlertDescription>
                </Alert>
                {eventDetails.warnings.map((warning, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription>{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Localização</h2>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <EventMap coordinates={eventDetails.coordinates} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-primary">Ingressos</h2>
              <div className="space-y-4">
                {eventDetails.tickets.map((ticket) => (
                  <TicketSelector
                    key={ticket.id}
                    ticket={ticket}
                    quantity={selectedTickets[ticket.id] || 0}
                    onQuantityChange={(quantity) => 
                      setSelectedTickets(prev => ({...prev, [ticket.id]: quantity}))
                    }
                  />
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-primary text-white hover:opacity-90"
                  size="lg"
                  disabled={!hasSelectedTickets}
                >
                  Finalizar pedido
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Ao finalizar o pedido você concorda com os termos de uso e política de privacidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EventDetailsPage
