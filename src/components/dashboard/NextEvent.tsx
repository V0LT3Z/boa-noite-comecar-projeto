import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, ChevronRight, ChevronLeft } from "lucide-react"
import QRCode from "react-qr-code"

const NextEvent = () => {
  // Simulando múltiplos eventos
  const [events] = useState([
    {
      id: 1,
      title: "Show do Metallica",
      date: "2024-05-15",
      time: "20:00",
      location: "Allianz Parque, São Paulo",
      tickets: [
        {
          id: 101,
          ticketCode: "L1-2024-0001",
          qrValue: "EVENT-1-TICKET-L1-2024-0001",
          seat: "Pista Premium - Entrada A"
        },
        {
          id: 102,
          ticketCode: "L1-2024-0002",
          qrValue: "EVENT-1-TICKET-L1-2024-0002",
          seat: "Pista Premium - Entrada A"
        }
      ]
    },
    {
      id: 2,
      title: "Festival de Verão",
      date: "2024-06-01",
      time: "16:00",
      location: "Praia de Copacabana, Rio de Janeiro",
      tickets: [
        {
          id: 201,
          ticketCode: "L2-2024-0002",
          qrValue: "EVENT-2-TICKET-L2-2024-0002",
          seat: "Área VIP"
        }
      ]
    },
    {
      id: 3,
      title: "Stand Up Comedy",
      date: "2024-05-20",
      time: "21:00",
      location: "Teatro Municipal, São Paulo",
      tickets: [
        {
          id: 301,
          ticketCode: "L1-2024-0003",
          qrValue: "EVENT-3-TICKET-L1-2024-0003",
          seat: "Plateia Central - Fileira B"
        },
        {
          id: 302,
          ticketCode: "L1-2024-0004",
          qrValue: "EVENT-3-TICKET-L1-2024-0004",
          seat: "Plateia Central - Fileira B"
        },
        {
          id: 303,
          ticketCode: "L1-2024-0005",
          qrValue: "EVENT-3-TICKET-L1-2024-0005",
          seat: "Plateia Central - Fileira B"
        }
      ]
    }
  ])

  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)

  const handlePreviousEvent = () => {
    setCurrentEventIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
    setCurrentTicketIndex(0) // Reset ticket index when changing events
  }

  const handleNextEvent = () => {
    setCurrentEventIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
    setCurrentTicketIndex(0) // Reset ticket index when changing events
  }

  const handleNextTicket = () => {
    setCurrentTicketIndex((prev) => 
      prev === currentEvent.tickets.length - 1 ? 0 : prev + 1
    )
  }

  const handlePreviousTicket = () => {
    setCurrentTicketIndex((prev) => 
      prev === 0 ? currentEvent.tickets.length - 1 : prev - 1
    )
  }

  const currentEvent = events[currentEventIndex]
  const currentTicket = currentEvent.tickets[currentTicketIndex]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Seus próximos eventos</h2>
        <div className="text-sm text-muted-foreground">
          {currentEventIndex + 1} de {events.length}
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{currentEvent.title}</h3>
            <div className="flex flex-col gap-2 text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(currentEvent.date).toLocaleDateString('pt-BR')} às {currentEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{currentEvent.location}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-primary">Seus ingressos</h4>
              {currentEvent.tickets.length > 1 && (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <span>{currentTicketIndex + 1} de {currentEvent.tickets.length}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 relative">
              <div 
                className="flex flex-col items-center justify-center gap-4 p-4 bg-white rounded-lg mb-3 cursor-pointer"
                onClick={currentEvent.tickets.length > 1 ? handleNextTicket : undefined}
              >
                {currentEvent.tickets.length > 1 && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="rounded-full bg-white shadow-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousTicket();
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <QRCode
                  value={currentTicket.qrValue}
                  size={150}
                  className="max-w-full h-auto"
                />
                
                {currentEvent.tickets.length > 1 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="rounded-full bg-white shadow-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextTicket();
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-center text-muted-foreground">
                  Apresente este QR Code na entrada do evento
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Código do ingresso:</p>
                <p className="text-base font-mono">{currentTicket.ticketCode}</p>
                {currentTicket.seat && (
                  <p className="text-sm text-muted-foreground">{currentTicket.seat}</p>
                )}
              </div>
            </div>
          </div>

          <Button className="w-full" asChild>
            <a href={`/evento/${currentEvent.id}`}>
              Ver detalhes do evento
            </a>
          </Button>
        </div>

        {events.length > 1 && (
          <div className="flex justify-between mt-6 gap-4">
            <Button 
              variant="outline" 
              onClick={handlePreviousEvent}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Evento anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNextEvent}
              className="flex-1"
            >
              Próximo evento
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default NextEvent
