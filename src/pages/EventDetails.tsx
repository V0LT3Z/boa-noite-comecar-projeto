import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EventMap from "@/components/EventMap";
import TicketSelector from "@/components/TicketSelector";
import FavoriteButton from "@/components/FavoriteButton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventDetails as EventDetailsType } from "@/types/event";
import { fetchEventById } from "@/services/events";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadEventDetails() {
      if (!id) {
        toast({
          title: "Evento não encontrado",
          description: "Nenhum evento especificado.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        setIsLoading(true);
        const eventId = parseInt(id);
        const eventData = await fetchEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          toast({
            title: "Evento não encontrado",
            description: "Não foi possível encontrar os detalhes para este evento.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        toast({
          title: "Erro ao carregar evento",
          description: "Ocorreu um erro ao carregar os detalhes do evento.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadEventDetails();
  }, [id, toast]);

  const handlePurchase = async (selectedTickets: { ticketId: number, quantity: number }[]) => {
    if (!id || selectedTickets.length === 0) return;
    
    try {
      // Chamar a edge function do Supabase para criar a sessão de checkout
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: parseInt(id),
          selectedTickets
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar checkout');
      }
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de checkout não disponível');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast({
        title: "Erro no processo de compra",
        description: "Ocorreu um erro ao processar sua compra. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando detalhes do evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Evento não encontrado.</p>
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="space-y-6">
          <div>
            <img
              src={event.image}
              alt={event.title}
              className="w-full rounded-lg mb-4 object-cover h-48"
            />
            <h1 className="text-2xl font-bold text-primary mb-2">{event.title}</h1>
            <div className="flex flex-col gap-2 text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {new Date(event.date).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {event.location}
              </div>
            </div>
          </div>

          <TicketSelector 
            tickets={event.tickets} 
            onPurchase={handlePurchase}
          />

          <Card className="mb-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-gray-700">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-6">
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
                className="mt-2 p-0"
              >
                <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                  Ver no Mapa
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
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

          <div className="mt-6">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={event.image}
            alt={event.title}
            className="w-full rounded-lg mb-4 object-cover h-48 md:h-64"
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
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-gray-700">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-6">
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
                className="mt-2 p-0"
              >
                <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                  Ver no Mapa
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
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

        <div>
          <TicketSelector 
            tickets={event.tickets} 
            onPurchase={handlePurchase}
          />
          <div className="mt-6">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderContent()}
    </div>
  );
};

export default EventDetails;
