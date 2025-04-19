
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EventMap from "@/components/EventMap";
import TicketSelector from "@/components/TicketSelector";
import FavoriteButton from "@/components/FavoriteButton";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { EventDetails as EventDetailsType } from "@/types/event";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDetailsType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      const eventData = eventsMockData[eventId];
      if (eventData) {
        setEvent(eventData);
      } else {
        toast({
          title: "Evento não encontrado",
          description: "Não foi possível encontrar os detalhes para este evento.",
          variant: "destructive",
        });
      }
    }
  }, [eventId, toast]);

  // Mock data for events - updated to include the venue property
  const eventsMockData: Record<string, EventDetailsType> = {
    "1": {
      id: 1,
      title: "Festival de Música Eletrônica 2023",
      date: "2023-05-20",
      time: "22:00",
      location: "Arena São Paulo",
      coordinates: {
        lat: -23.5505,
        lng: -46.6333
      },
      description: "O maior festival de música eletrônica do Brasil. Uma experiência sensacional com os melhores DJs do mundo.",
      image: "https://source.unsplash.com/random?electronic,music,festival",
      minimumAge: 18,
      tickets: [
        {
          id: 1,
          name: "Pista",
          price: 120.00,
          description: "Acesso à pista principal do evento",
          availableQuantity: 300,
          maxPerPurchase: 4
        },
        {
          id: 2,
          name: "VIP",
          price: 250.00,
          description: "Acesso à área VIP com open bar",
          availableQuantity: 100,
          maxPerPurchase: 2
        },
        {
          id: 3,
          name: "Backstage",
          price: 450.00,
          description: "Acesso à área backstage e meet & greet com os artistas",
          availableQuantity: 30,
          maxPerPurchase: 2
        }
      ],
      warnings: [
        "É proibida a entrada com bebidas e alimentos externos",
        "É obrigatória a apresentação de documento com foto",
        "Menores de 16 anos apenas acompanhados dos pais ou responsáveis legais"
      ],
      venue: {
        name: "Arena São Paulo",
        address: "Av. Exemplo, 1000 - São Paulo, SP",
        capacity: 5000,
        map_url: "https://map-url-example.com"
      }
    },
    "2": {
      id: 2,
      title: "Show de Rock - Bandas Nacionais",
      date: "2023-06-15",
      time: "20:00",
      location: "Estádio Municipal",
      coordinates: {
        lat: -23.5458,
        lng: -46.6358
      },
      description: "Um super show de rock com as melhores bandas nacionais. Uma noite épica para os amantes do bom e velho rock n' roll.",
      image: "https://source.unsplash.com/random?rock,concert",
      minimumAge: 16,
      tickets: [
        {
          id: 4,
          name: "Arquibancada",
          price: 90.00,
          description: "Acesso à arquibancada geral",
          availableQuantity: 500,
          maxPerPurchase: 4
        },
        {
          id: 5,
          name: "Pista Premium",
          price: 180.00,
          description: "Acesso à pista premium próxima ao palco",
          availableQuantity: 200,
          maxPerPurchase: 4
        }
      ],
      warnings: [
        "É proibido fumar em qualquer área do evento",
        "Sujeito a revista na entrada"
      ],
      venue: {
        name: "Estádio Municipal",
        address: "R. do Estádio, 500 - São Paulo, SP",
        capacity: 8000,
        map_url: "https://map-url-example.com"
      }
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {eventId ? (
          <p className="text-gray-600">Carregando detalhes do evento...</p>
        ) : (
          <p className="text-red-500">Nenhum evento especificado.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Details */}
          <div>
            <img
              src={event.image}
              alt={event.title}
              className="w-full rounded-lg mb-4"
            />
            <h1 className="text-3xl font-bold text-primary mb-2">{event.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(event.date).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <Separator orientation="vertical" className="mx-2 h-5" />
              <Clock className="mr-2 h-5 w-5" />
              {event.time}
              <Separator orientation="vertical" className="mx-2 h-5" />
              <MapPin className="mr-2 h-5 w-5" />
              {event.location}
            </div>
            <Card className="mb-4">
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-gray-700">{event.description}</p>
              </CardContent>
            </Card>

            {/* Venue Details */}
            <Card className="mb-4">
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">Local do Evento</h2>
                <p className="text-gray-700">
                  <strong>{event.venue.name}</strong>
                  <br />
                  {event.venue.address}
                  <br />
                  Capacidade: {event.venue.capacity}
                </p>
                <Button
                  variant="link"
                  asChild
                  className="mt-2"
                >
                  <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                    Ver no Mapa
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardContent>
                <h2 className="text-xl font-semibold mb-2">Avisos</h2>
                {event.warnings.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {event.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">Nenhum aviso especial para este evento.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ticket Selection and Map */}
          <div>
            <TicketSelector eventId={event.id.toString()} tickets={event.tickets} />
            <FavoriteButton eventId={event.id.toString()} />
            <EventMap
              coordinates={{
                lat: event.coordinates.lat,
                lng: event.coordinates.lng
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
