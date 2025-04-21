
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import EventMap from "@/components/EventMap";
import TicketSelector from "@/components/TicketSelector";
import FavoriteButton from "@/components/FavoriteButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventDetails as EventDetailsType } from "@/types/event";
import { fetchEventById } from "@/services/events";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadEventDetails() {
      if (!id) {
        toast.error("Evento não encontrado", {
          description: "Nenhum evento especificado.",
        });
        navigate("/");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Converter string para número, mas garantindo que temos um valor
        const eventId = parseInt(id);
        if (isNaN(eventId)) {
          throw new Error("ID do evento inválido");
        }
        
        console.log("Buscando evento com ID:", eventId);
        const eventData = await fetchEventById(eventId);
        
        if (eventData) {
          console.log("Evento encontrado:", eventData);
          setEvent(eventData);
        } else {
          throw new Error("Evento não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        setError("Não foi possível encontrar os detalhes para este evento.");
        toast.error("Evento não encontrado", {
          description: "Não foi possível encontrar os detalhes para este evento.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadEventDetails();
  }, [id, navigate]);

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
      toast.error("Erro no processo de compra", {
        description: "Ocorreu um erro ao processar sua compra. Por favor, tente novamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeletons isMobile={isMobile} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-[50vh] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold">Evento não encontrado</p>
                <p className="text-sm text-gray-500">Não foi possível encontrar os detalhes para este evento.</p>
              </div>
            </div>
            <Button onClick={() => navigate('/')} className="mt-6">
              Voltar para Home
            </Button>
          </div>
        </div>
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

// Componente para exibir os skeletons durante o carregamento
const LoadingSkeletons = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </CardContent>
        </Card>
        
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="mb-6">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-2" />
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="mb-6">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
        
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
};

export default EventDetails;
