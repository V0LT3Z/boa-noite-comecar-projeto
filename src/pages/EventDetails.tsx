import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import EventMap from "@/components/EventMap";
import TicketSelector from "@/components/TicketSelector";
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

        const eventId = parseInt(id);
        if (isNaN(eventId)) {
          throw new Error("ID do evento inválido");
        }

        const eventData = await fetchEventById(eventId);

        if (eventData) {
          setEvent(eventData);
        } else {
          throw new Error("Evento não encontrado");
        }
      } catch (error) {
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
      toast.error("Erro no processo de compra", {
        description: "Ocorreu um erro ao processar sua compra. Por favor, tente novamente.",
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="outline"
      onClick={onClick}
      className="group flex items-center gap-2 py-2 px-4 rounded-lg bg-white/80 backdrop-blur-sm border-none hover:bg-primary/10 transition-all duration-200"
    >
      <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Voltar</span>
    </Button>
  );

  const ModernErrorText = () => (
    <div className="text-center w-full flex flex-col justify-center items-center px-2">
      <div className="rounded-xl bg-white/80 shadow-lg px-6 py-7 max-w-md mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-xl md:text-2xl text-primary mb-1">Evento não encontrado</p>
        <p className="text-gray-500 text-base">Não foi possível encontrar os detalhes para este evento.</p>
      </div>
      <BackButton onClick={() => window.location.href = '/'} />
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-6 px-4">
        <LoadingSkeletons isMobile={isMobile} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <ModernErrorText />
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col max-w-full gap-5">
          <div className="mb-2">
            <BackButton onClick={handleBackToHome} />
          </div>
          <div className="relative w-full rounded-xl overflow-hidden h-48 shadow-md">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
          </div>
          <h1 className="text-xl font-bold mb-1 text-primary leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-primary">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/30 rounded-full text-xs font-medium text-primary">
              <Clock className="h-3.5 w-3.5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/30 rounded-full text-xs font-medium text-primary">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location}</span>
            </div>
          </div>
          <TicketSelector tickets={event.tickets} onPurchase={handlePurchase} />

          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-1 text-primary">Descrição</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-1 text-secondary">Local do Evento</h2>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">{event.venue.name}</span><br/>
              {event.venue.address}<br/>
              Capacidade: <span className="font-medium">{event.venue.capacity}</span>
            </p>
            <Button
              variant="link"
              asChild
              className="mt-1 p-0 text-primary hover:text-secondary"
            >
              <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                Ver no Mapa
              </a>
            </Button>
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-1 text-pink-600">Avisos</h2>
            {event.warnings && event.warnings.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-0.5">
                {event.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-sm">Nenhum aviso especial para este evento.</p>
            )}
          </div>
          <div className="mt-3">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="flex flex-col max-w-full">
          <div className="mb-4">
            <BackButton onClick={handleBackToHome} />
          </div>
          <div className="relative w-full rounded-xl overflow-hidden h-72 shadow-md mb-4">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2 leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-soft-purple/30 rounded-full text-sm font-medium text-primary">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-soft-blue/30 rounded-full text-sm font-medium text-primary">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-soft-pink/30 rounded-full text-sm font-medium text-primary">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-primary">Descrição</h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">{event.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-secondary">Local do Evento</h2>
            <p className="text-gray-700 text-[15px]">
              <span className="font-semibold">{event.venue.name}</span><br/>
              {event.venue.address}<br/>
              Capacidade: <span className="font-medium">{event.venue.capacity}</span>
            </p>
            <Button
              variant="link"
              asChild
              className="mt-1 p-0 text-primary hover:text-secondary"
            >
              <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                Ver no Mapa
              </a>
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">Avisos</h2>
            {event.warnings && event.warnings.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-1">
                {event.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-[15px]">Nenhum aviso especial para este evento.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <Card className="bg-white/80 shadow-md border-0 p-2 pt-4 pb-6">
              <CardContent className="p-0">
                <TicketSelector 
                  tickets={event.tickets} 
                  onPurchase={handlePurchase}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-soft-blue/20 border-0 shadow-md rounded-xl">
              <CardContent className="p-0">
                <EventMap coordinates={event.coordinates} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] w-full px-4 py-6 max-w-[1440px] mx-auto">
      {renderContent()}
    </div>
  );
};

const LoadingSkeletons = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div>
          <Skeleton className="h-7 w-3/5 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-32 mb-1" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>

        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <Skeleton className="h-60 w-full mb-3 rounded-xl" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <div className="mb-4">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="h-6 w-32 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-9 w-full mt-3" />
        </div>
        <Skeleton className="h-44 w-full mt-5 rounded-xl" />
      </div>
    </div>
  );
};

export default EventDetails;
