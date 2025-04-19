
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
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
      ticketCode: "L1-2024-0001",
      qrValue: "EVENT-1-TICKET-L1-2024-0001"
    },
    {
      id: 2,
      title: "Festival de Verão",
      date: "2024-06-01",
      time: "16:00",
      location: "Praia de Copacabana, Rio de Janeiro",
      ticketCode: "L2-2024-0002",
      qrValue: "EVENT-2-TICKET-L2-2024-0002"
    },
    {
      id: 3,
      title: "Stand Up Comedy",
      date: "2024-05-20",
      time: "21:00",
      location: "Teatro Municipal, São Paulo",
      ticketCode: "L1-2024-0003",
      qrValue: "EVENT-3-TICKET-L1-2024-0003"
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1))
  }

  const currentEvent = events[currentIndex]

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Seus próximos eventos</h2>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} de {events.length}
        </div>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentEvent.title}</h3>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(currentEvent.date).toLocaleDateString('pt-BR')} às {currentEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{currentEvent.location}</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-medium">Código do ingresso:</p>
              <p className="text-lg font-mono">{currentEvent.ticketCode}</p>
            </div>
            <Button className="w-full" asChild>
              <a href={`/evento/${currentEvent.id}`}>
                Ver detalhes do evento
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 p-4 bg-white rounded-lg">
            <QRCode
              value={currentEvent.qrValue}
              size={180}
              className="max-w-full h-auto"
            />
            <p className="text-sm text-center text-muted-foreground">
              Apresente este QR Code na entrada do evento
            </p>
          </div>
        </div>

        {events.length > 1 && (
          <div className="flex justify-between mt-6 gap-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNext}
              className="flex-1"
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default NextEvent
