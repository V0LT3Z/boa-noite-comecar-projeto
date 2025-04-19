
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import QRCode from "react-qr-code"

const NextEvent = () => {
  // Simulando dados do próximo evento
  const [nextEvent] = useState({
    id: 1,
    title: "Show do Metallica",
    date: "2024-05-15",
    time: "20:00",
    location: "Allianz Parque, São Paulo",
    ticketCode: "L1-2024-0001", // L1 = Lote 1
    qrValue: "EVENT-1-TICKET-L1-2024-0001"
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Seu próximo evento</h2>
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{nextEvent.title}</h3>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(nextEvent.date).toLocaleDateString('pt-BR')} às {nextEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{nextEvent.location}</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-medium">Código do ingresso:</p>
              <p className="text-lg font-mono">{nextEvent.ticketCode}</p>
            </div>
            <Button className="w-full" asChild>
              <a href={`/evento/${nextEvent.id}`}>
                Ver detalhes do evento
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 p-4 bg-white rounded-lg">
            <QRCode
              value={nextEvent.qrValue}
              size={180}
              className="max-w-full h-auto"
            />
            <p className="text-sm text-center text-muted-foreground">
              Apresente este QR Code na entrada do evento
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default NextEvent
