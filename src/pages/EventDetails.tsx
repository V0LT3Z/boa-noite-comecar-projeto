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
import GradientCard from "@/components/GradientCard";

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
      variant="ghost"
      onClick={onClick}
      className="flex items-center gap-1.5 py-1.5 px-4 rounded-md bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 text-primary shadow-sm border border-white/40"
    >
      <ArrowLeft className="h-4 w-4" />
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
        <div className="flex flex-col w-full gap-5">
          <div className="relative w-full mb-2">
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-t-2xl" />
            <div className="relative pt-4 pl-4">
              <BackButton onClick={handleBackToHome} />
            </div>
          </div>
          
          <div className="relative w-full rounded-2xl overflow-hidden h-56 shadow-md mb-1">
            <img
              src={event.image || '/placeholder.svg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <GradientCard className="w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg md:text-xl font-bold text-primary leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-0">
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-gray-700">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/30 rounded-full text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5 text-secondary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/30 rounded-full text-xs font-medium text-gray-700">
                  <MapPin className="h-3.5 w-3.5 text-pink-500" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </div>
          </GradientCard>
          
          <GradientCard className="w-full">
            <TicketSelector tickets={event.tickets} onPurchase={handlePurchase} />
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-base font-semibold mb-2 text-gray-800">Descrição</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-base font-semibold mb-2 text-gray-800">Local do Evento</h2>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">{event.venue.name}</span><br />
              {event.venue.address}<br />
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
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-base font-semibold mb-2 text-gray-800">Avisos</h2>
            {event.warnings && event.warnings.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                {event.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-sm">Nenhum aviso especial para este evento.</p>
            )}
          </GradientCard>
          
          <div className="mt-2">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="relative w-full mb-1">
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-t-2xl" />
            <div className="relative pt-4 pl-4">
              <BackButton onClick={handleBackToHome} />
            </div>
          </div>
          
          <div className="relative w-full rounded-2xl overflow-hidden h-72 shadow-lg mb-2">
            <img
              src={event.image || '/placeholder.svg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <GradientCard className="w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-primary leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/30 rounded-full text-xs font-medium text-gray-700">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/30 rounded-full text-xs font-medium text-gray-700">
                  <Clock className="h-3.5 w-3.5 text-secondary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/30 rounded-full text-xs font-medium text-gray-700">
                  <MapPin className="h-3.5 w-3.5 text-pink-500" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
            </div>
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Descrição</h2>
            <p className="text-gray-700 text-base leading-relaxed">{event.description}</p>
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Local do Evento</h2>
            <p className="text-gray-700 text-base">
              <span className="font-semibold">{event.venue.name}</span><br />
              {event.venue.address}<br />
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
          </GradientCard>
          
          <GradientCard className="w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Avisos</h2>
            {event.warnings && event.warnings.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 text-base space-y-1.5">
                {event.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 text-base">Nenhum aviso especial para este evento.</p>
            )}
          </GradientCard>
          
          <div className="mt-2">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
        
        <div className="col-span-1 flex flex-col gap-4 h-fit">
          <GradientCard className="w-full">
            <TicketSelector tickets={event.tickets} onPurchase={handlePurchase} />
          </GradientCard>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[90vh] w-full px-2 sm:px-0 lg:px-0 py-5 max-w-[1800px] mx-auto bg-[#f5f6fb]">
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
