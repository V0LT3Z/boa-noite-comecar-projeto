
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Imported refactored components
import HeroSection from "@/components/home/HeroSection";
import EventsGrid from "@/components/home/EventsGrid";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const { toast } = useToast();
  
  const loadEvents = useCallback(async () => {
    if (eventsLoaded) return; // Evita múltiplas chamadas se os eventos já foram carregados
    
    try {
      setLoading(true);
      const eventData = await fetchEvents();
      console.log("Eventos carregados:", eventData);
      
      if (!eventData || eventData.length === 0) {
        setEvents([]);
        console.log("Nenhum evento encontrado no banco de dados");
        
        // Exibir toast informativo apenas na primeira carga
        if (!eventsLoaded) {
          toast({
            title: "Nenhum evento disponível",
            description: "Ainda não há eventos disponíveis. Os produtores podem criar novos eventos na área administrativa.",
            variant: "default",
          });
        }
      } else {
        // Filter out cancelled events
        const activeEvents = eventData.filter(event => event.status !== "cancelled");
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

  const formattedEvents = useMemo(() => {
    return events.map(event => {
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
    
  // Destacar os 5 primeiros eventos para o carrossel da Hero
  const heroEvents = useMemo(() => {
    return events
      .filter(event => event.status !== "cancelled")
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        title: event.title,
        date: format(new Date(event.date), "dd 'de' MMMM yyyy", { locale: ptBR }),
        image: event.image_url || "https://picsum.photos/seed/" + event.id + "/800/500"
      }));
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-gray to-soft-purple/20">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero section com banner principal e informações */}
        <div className="pt-8">
          {!loading && <HeroSection events={heroEvents} />}
        </div>
        
        {/* Lista de eventos */}
        {!loading && (
          <section className="mt-16">
            <EventsGrid 
              events={filteredEvents} 
              loading={loading} 
              showAllEvents={showAllEvents}
              setShowAllEvents={setShowAllEvents}
              searchQuery={searchQuery}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default Index;
