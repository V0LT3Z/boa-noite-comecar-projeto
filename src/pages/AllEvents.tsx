
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Key for storing deleted event IDs in localStorage
const DELETED_EVENTS_KEY = 'deletedEventIds';

const AllEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  // Track locally deleted events
  const [locallyDeletedEvents, setLocallyDeletedEvents] = useState<number[]>([]);
  
  const { toast } = useToast();
  
  // Get deleted events from localStorage
  useEffect(() => {
    try {
      const savedIds = localStorage.getItem(DELETED_EVENTS_KEY);
      if (savedIds) {
        const deletedIds = JSON.parse(savedIds);
        console.log("Eventos previamente deletados:", deletedIds);
        setLocallyDeletedEvents(deletedIds);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos deletados:", error);
    }
  }, []);
  
  const loadEvents = useCallback(async () => {
    if (eventsLoaded) return; // Evita múltiplas chamadas se os eventos já foram carregados
    
    try {
      setLoading(true);
      const eventData = await fetchEvents();
      console.log("Eventos carregados:", eventData);
      
      if (!eventData || eventData.length === 0) {
        setEvents([]);
        console.log("Nenhum evento encontrado no banco de dados");
        
        toast({
          title: "Nenhum evento disponível",
          description: "Ainda não há eventos disponíveis. Os produtores podem criar novos eventos na área administrativa.",
          variant: "default",
        });
      } else {
        // Filter out cancelled events and already deleted events
        const activeEvents = eventData.filter(event => {
          const isDeleted = locallyDeletedEvents.includes(event.id);
          return event.status !== "cancelled" && !isDeleted;
        });
        console.log("Eventos ativos após filtro:", activeEvents.length);
        setEvents(activeEvents);
      }
      
      setEventsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setEvents([]);
      
      toast({
        title: "Falha ao carregar eventos",
        description: "Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [eventsLoaded, toast, locallyDeletedEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  const handleSearch = (query: string) => {
    // Update URL with search query
    setSearchParams(query ? { q: query } : {});
  };
  
  // Function to mark an event as deleted locally
  const handleMarkDeleted = (id: number) => {
    console.log(`Marcando evento ${id} como excluído localmente`);
    
    // Update local state
    setLocallyDeletedEvents(prev => {
      const updated = [...prev, id];
      // Also update localStorage for persistence
      try {
        localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao salvar eventos excluídos:", error);
      }
      return updated;
    });
    
    // Remove from current events list
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const formattedEvents = useMemo(() => {
    return events
      .filter(event => !locallyDeletedEvents.includes(event.id))
      .map(event => {
      try {
        const eventDate = new Date(event.date);
        return {
          id: event.id,
          title: event.title,
          date: format(eventDate, "dd 'de' MMMM yyyy", { locale: ptBR }),
          location: event.location,
          image: event.image_url || "https://picsum.photos/seed/" + event.id + "/800/500",
          category: "Eventos",
          status: event.status
        };
      } catch (error) {
        console.error("Erro ao formatar evento:", error, event);
        return {
          id: event.id || 0,
          title: event.title || "Evento sem título",
          date: "Data não disponível",
          location: event.location || "Local não informado",
          image: "https://picsum.photos/seed/fallback/800/500",
          category: "Eventos",
          status: "active"
        };
      }
    });
  }, [events, locallyDeletedEvents]);

  const filteredEvents = useMemo(() => {
    return formattedEvents.filter(event => {
      // Filter by search query if provided
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesSearch;
    });
  }, [formattedEvents, searchQuery]);

  // Renderização do esqueleto durante o carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[...Array(12)].map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderização quando não há eventos
  if (filteredEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft size={16} />
            <span>Voltar para página inicial</span>
          </Link>
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <h2 className="text-2xl font-semibold mb-2">Nenhum evento encontrado</h2>
            <p className="text-muted-foreground">
              {searchQuery ? `Não encontramos eventos relacionados a "${searchQuery}"` : "No momento não há eventos disponíveis."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={16} />
          <span>Voltar para página inicial</span>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Eventos"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link key={event.id} to={`/evento/${event.id}`}>
              <EventCard
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image={event.image}
                status={event.status}
                onMarkDeleted={handleMarkDeleted}
              />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllEvents;
