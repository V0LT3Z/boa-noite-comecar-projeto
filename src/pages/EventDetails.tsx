import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
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
      variant="ghost"
      className="group relative overflow-hidden flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-white/70 glass shadow-xl
                hover:bg-gradient-to-r hover:from-primary hover:to-secondary transition-all duration-200 border-2 border-soft-purple
                font-bold text-primary hover:text-white before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-secondary before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
      onClick={onClick}
      style={{
        backdropFilter: 'blur(12px)',
      }}
    >
      <ArrowLeft className="h-5 w-5 group-hover:animate-slide-in-right transition-transform" />
      <span className="relative z-10">Voltar para Home</span>
    </Button>
  );

  const ModernErrorText = () => (
    <div className="text-center">
      <div className="bg-white/80 rounded-xl shadow-lg border-2 border-soft-pink px-6 py-8 flex items-center max-w-md mx-auto animate-fade-in glass">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-left">
          <p className="font-extrabold text-2xl text-primary drop-shadow text-gradient-primary mb-1">
            Evento não encontrado
          </p>
          <p className="text-gray-500 text-base">Não foi possível encontrar os detalhes para este evento.</p>
        </div>
      </div>
      <ModernBackButton onClick={() => window.location.href = '/'} />
    </div>
  );

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
          <ModernErrorText />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="space-y-6">
          <ModernBackButton onClick={handleBackToHome} />
          <div className="relative w-full rounded-2xl overflow-hidden h-52 shadow-xl border glass">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"/>
          </div>
          <h1 className="text-3xl font-extrabold mb-3 mt-2 text-gradient-primary drop-shadow-lg">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/80 rounded-full text-sm font-semibold text-primary shadow">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/80 rounded-full text-sm font-semibold text-primary shadow">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/80 rounded-full text-sm font-semibold text-primary shadow">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <TicketSelector 
            tickets={event.tickets} 
            onPurchase={handlePurchase}
          />

          <Card className="mb-3 bg-white/80 backdrop-blur-lg shadow-lg border border-soft-purple">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-2 text-gradient-primary drop-shadow">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-3 bg-white/80 backdrop-blur-lg shadow-lg border border-soft-blue">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-1 text-secondary drop-shadow">Local do Evento</h2>
              <p className="text-gray-700 space-y-1">
                <span className="font-bold">{event.venue.name}</span><br/>
                {event.venue.address}<br/>
                Capacidade: <span className="font-semibold">{event.venue.capacity}</span>
              </p>
              <Button
                variant="link"
                asChild
                className="mt-2 p-0 text-primary hover:text-secondary"
              >
                <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                  Ver no Mapa
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-white/80 backdrop-blur-lg shadow-lg border border-soft-pink">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-1 text-pink-600 drop-shadow">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
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
          <ModernBackButton onClick={handleBackToHome} />
          <div className="relative w-full rounded-3xl overflow-hidden h-64 shadow-2xl border glass mb-5">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"/>
          </div>
          <h1 className="text-4xl font-extrabold text-gradient-primary mb-4 leading-tight drop-shadow-lg">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-7">
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-purple/80 rounded-full text-base font-semibold text-primary shadow">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-blue/80 rounded-full text-base font-semibold text-primary shadow">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-soft-pink/80 rounded-full text-base font-semibold text-primary shadow">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        
          <Card className="mb-4 bg-white/90 backdrop-blur-lg shadow-xl border-2 border-soft-purple">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2 text-gradient-primary drop-shadow">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-white/90 backdrop-blur-lg shadow-xl border-2 border-soft-blue">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2 text-secondary drop-shadow">Local do Evento</h2>
              <p className="text-gray-700 space-y-1">
                <span className="font-bold">{event.venue.name}</span><br/>
                {event.venue.address}<br/>
                Capacidade: <span className="font-semibold">{event.venue.capacity}</span>
              </p>
              <Button
                variant="link"
                asChild
                className="mt-2 p-0 text-primary hover:text-secondary"
              >
                <a href={event.venue.map_url} target="_blank" rel="noopener noreferrer">
                  Ver no Mapa
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-white/90 backdrop-blur-lg shadow-xl border-2 border-soft-pink">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2 text-pink-600 drop-shadow">Avisos</h2>
              {event.warnings && event.warnings.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
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
          <div className="mb-8">
            <Card className="bg-white/90 shadow-2xl border-2 border-soft-purple px-3 pt-3 pb-5 glass">
              <CardContent className="p-0">
                <TicketSelector 
                  tickets={event.tickets} 
                  onPurchase={handlePurchase}
                />
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card className="bg-soft-blue/40 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
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
    <div className="container mx-auto px-2 md:px-10 py-8 max-w-6xl">
      {renderContent()}
    </div>
  );
};

const LoadingSkeletons = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-lg border-soft-purple">
          <CardContent className="pt-6">
            <Skeleton className="h-7 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Skeleton className="h-64 w-full mb-4 rounded-2xl" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="mb-6">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-2" />
        </div>

        <Card className="bg-white/80 backdrop-blur-lg border-soft-purple">
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
        <Card className="bg-white/90 border-none shadow-xl">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>

        <Skeleton className="h-64 w-full mt-6 rounded-lg" />
      </div>
    </div>
  );
};

export default EventDetails;
