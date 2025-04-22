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

  const ModernBackButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="outline"
      onClick={onClick}
      className="group flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-tr from-primary to-secondary shadow-lg border-0 hover:scale-105 transition-all duration-200 font-bold text-white text-lg relative overflow-hidden"
      style={{
        boxShadow: "0 6px 30px 0 rgba(140, 82, 255, 0.12)",
        minWidth: 0,
      }}
    >
      <span className="relative flex items-center">
        <ArrowLeft className="h-6 w-6 stroke-2 group-hover:-translate-x-1 transition-transform" />
        <span className="ml-2 tracking-wide drop-shadow max-sm:text-base">Voltar para Home</span>
      </span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-white pointer-events-none"></span>
    </Button>
  );

  const ModernErrorText = () => (
    <div className="text-center w-full flex flex-col justify-center items-center px-2">
      <div className="rounded-xl bg-white/80 shadow-lg px-6 py-7 max-w-md mx-auto mb-6 glass border-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-xl md:text-2xl text-primary mb-1">Evento não encontrado</p>
        <p className="text-gray-500 text-base">Não foi possível encontrar os detalhes para este evento.</p>
      </div>
      <ModernBackButton onClick={() => window.location.href = '/'} />
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full mx-auto py-8 sm:px-2 md:px-6 max-w-screen-xl">
        <LoadingSkeletons isMobile={isMobile} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full mx-auto py-8 flex justify-center items-center min-h-[50vh] bg-white/60">
        <ModernErrorText />
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col max-w-full gap-5">
          <ModernBackButton onClick={handleBackToHome} />
          <div className="relative w-full rounded-2xl overflow-hidden h-48 shadow-lg glass">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"/>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-gradient-primary tracking-tight leading-snug">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-soft-purple/70 rounded-full text-xs font-medium text-primary shadow-sm">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-soft-blue/70 rounded-full text-xs font-medium text-primary shadow-sm">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-soft-pink/70 rounded-full text-xs font-medium text-primary shadow-sm">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <TicketSelector tickets={event.tickets} onPurchase={handlePurchase} />

          <Card className="mb-1 bg-white/70 shadow-lg glass border-0">
            <CardContent className="pt-4">
              <h2 className="text-base font-semibold mb-1 text-gradient-primary">Descrição</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-1 bg-white/70 shadow-lg glass border-0">
            <CardContent className="pt-4">
              <h2 className="text-base font-semibold mb-0 text-secondary">Local do Evento</h2>
              <p className="text-gray-700 text-sm space-y-1">
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
            </CardContent>
          </Card>

          <Card className="mb-2 bg-white/70 shadow-lg glass border-0">
            <CardContent className="pt-4">
              <h2 className="text-base font-semibold mb-1 text-pink-600">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-0.5">
                  {event.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 text-sm">Nenhum aviso especial para este evento.</p>
              )}
            </CardContent>
          </Card>
          <div className="mt-3">
            <EventMap coordinates={event.coordinates} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-10 md:gap-14">
        <div className="flex flex-col max-w-full">
          <ModernBackButton onClick={handleBackToHome} />
          <div className="relative w-full rounded-3xl overflow-hidden h-72 shadow-xl glass mb-5">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent z-10"/>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gradient-primary mb-1 leading-snug tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/60 rounded-full text-sm font-medium text-primary shadow">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/60 rounded-full text-sm font-medium text-primary shadow">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/60 rounded-full text-sm font-medium text-primary shadow">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        
          <Card className="mb-2 bg-white/65 shadow-lg glass border-0">
            <CardContent className="pt-5">
              <h2 className="text-base font-semibold mb-1 text-gradient-primary">Descrição</h2>
              <p className="text-gray-700 text-[15px] leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-2 bg-white/65 shadow-lg glass border-0">
            <CardContent className="pt-5">
              <h2 className="text-base font-semibold mb-1 text-secondary">Local do Evento</h2>
              <p className="text-gray-700 text-[15px] space-y-1">
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
            </CardContent>
          </Card>

          <Card className="mb-2 bg-white/65 shadow-lg glass border-0">
            <CardContent className="pt-5">
              <h2 className="text-base font-semibold mb-1 text-pink-600">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-0.5">
                  {event.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 text-[15px]">Nenhum aviso especial para este evento.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col justify-start max-w-full">
          <div className="mb-6">
            <Card className="bg-white/70 shadow-2xl glass border-0 p-3 pt-3 pb-6">
              <CardContent className="p-0">
                <TicketSelector 
                  tickets={event.tickets} 
                  onPurchase={handlePurchase}
                />
              </CardContent>
            </Card>
          </div>
          <div className="mt-5">
            <Card className="bg-soft-blue/40 backdrop-blur-lg border-0 shadow-xl rounded-2xl glass">
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
    <div className="min-h-[90vh] w-full px-2 md:px-[3vw] py-6 md:py-8" style={{ maxWidth: "1280px", margin: "0 auto" }}>
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

        <Card className="bg-white/60 glass border-0">
          <CardContent className="pt-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <Skeleton className="h-60 w-full mb-3 rounded-2xl" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <div className="mb-4">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-2" />
        </div>
        <Card className="bg-white/60 glass border-0">
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="bg-white/70 glass border-0">
          <CardContent className="p-4">
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-9 w-full mt-3" />
          </CardContent>
        </Card>
        <Skeleton className="h-44 w-full mt-5 rounded-xl" />
      </div>
    </div>
  );
};

export default EventDetails;
