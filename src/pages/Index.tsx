
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Imported refactored components
import EventsGrid from "@/components/home/EventsGrid";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const { toast } = useToast();
  
  // Carregar eventos com cachê
  const loadEvents = useCallback(async (forceReload: boolean = false) => {
    if (eventsLoaded && !forceReload) return; // Evita múltiplas chamadas se os eventos já foram carregados
    
    try {
      setLoading(true);
      const eventData = await fetchEvents();
      
      if (!eventData || eventData.length === 0) {
        setEvents([]);
        
        // Exibir toast informativo apenas na primeira carga
        if (!eventsLoaded) {
          toast({
            title: "Nenhum evento disponível",
            description: "Ainda não há eventos disponíveis. Os produtores podem criar novos eventos na área administrativa.",
            variant: "default",
          });
        }
      } else {
        // Filtrar eventos cancelados
        const activeEvents = eventData.filter(event => event.status !== "cancelled");
        console.log(`Total de eventos: ${eventData.length}, Ativos após filtro: ${activeEvents.length}`);
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
  }, [eventsLoaded, toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  const handleSearch = (query: string) => {
    // Update URL with search query
    setSearchParams(query ? { q: query } : {});
  };

  // Marcar evento como excluído para não aparecer mais na interface
  const markEventAsDeleted = (eventId: number) => {
    // Atualizar o estado local removendo o evento
    setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
  };

  const formattedEvents = useMemo(() => {
    return events.map(event => {
      try {
        const eventDate = new Date(event.date);
        return {
          id: event.id,
          title: event.title,
          date: format(eventDate, "dd 'de' MMMM yyyy", { locale: ptBR }),
          location: event.location || "Local não informado",
          image: event.image_url || `https://picsum.photos/seed/${event.id}/800/500`,
          category: "Eventos",
          status: event.status || "active"
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
  }, [events]);

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
    
  // Eventos em destaque para o carrossel
  const featuredEvents = useMemo(() => {
    const activeEvents = formattedEvents.filter(event => event.status === "active");
    return activeEvents.slice(0, 3);
  }, [formattedEvents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20 flex flex-col font-gooddog">
      <Header />
      
      <main className="flex-1 pb-12">
        {/* Hero section com banner principal e informações - full width */}
        <div className="w-full">
          {!loading && filteredEvents.length > 0 && (
            <FeaturedCarousel events={featuredEvents} />
          )}
        </div>
        
        {/* Lista de eventos - constrained width */}
        {!loading && (
          <section className="mt-16 container mx-auto px-4 max-w-7xl">
            <EventsGrid 
              events={filteredEvents} 
              loading={loading} 
              showAllEvents={false}
              setShowAllEvents={() => {}}
              searchQuery={searchQuery}
              onMarkDeleted={markEventAsDeleted}
            />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
