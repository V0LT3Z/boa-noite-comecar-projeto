
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { getDeletedEventIds } from "@/services/utils/deletedEventsUtils";

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
  
  const loadEvents = useCallback(async (forceReload: boolean = false) => {
    if (eventsLoaded && !forceReload) return; // Evita múltiplas chamadas se os eventos já foram carregados
    
    try {
      setLoading(true);
      
      // Always force refresh when loading events on the main page
      const eventData = await fetchEvents(true);
      
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
        // Get fresh set of deleted event IDs
        const deletedEventIds = getDeletedEventIds();
        console.log(`Index: Checking ${deletedEventIds.size} deleted events`);
        
        // Filter out cancelled events AND deleted events
        const filteredEvents = eventData.filter(event => 
          event.status !== "cancelled" && !deletedEventIds.has(event.id)
        );
        
        console.log(`Total events: ${eventData.length}, Active: ${filteredEvents.length}, Deleted: ${deletedEventIds.size}`);
        setEvents(filteredEvents);
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
    // Always force refresh when first loading the index page
    loadEvents(true);
  }, [loadEvents]);
  
  const handleSearch = (query: string) => {
    // Update URL with search query
    setSearchParams(query ? { q: query } : {});
  };

  // Remove a non-existent event from UI 
  const removeNonexistentEvent = (eventId: number) => {
    console.log(`Index: Removing event ID ${eventId} from UI as it no longer exists`);
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
    // Get the current set of deleted event IDs
    const deletedEventIds = getDeletedEventIds();
    
    return formattedEvents.filter(event => {
      // Filter by search query if provided and ensure event is not deleted
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const isDeleted = deletedEventIds.has(event.id);
      if (isDeleted) {
        console.log(`Index: Event ${event.id} is in deleted list and won't be displayed`);
      }
      
      return matchesSearch && !isDeleted;
    });
  }, [formattedEvents, searchQuery]);
    
  // Eventos em destaque para o carrossel
  const featuredEvents = useMemo(() => {
    // Get the current set of deleted event IDs
    const deletedEventIds = getDeletedEventIds();
    
    const activeEvents = formattedEvents.filter(
      event => event.status === "active" && !deletedEventIds.has(event.id)
    );
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
        <section className="mt-16 container mx-auto px-4 max-w-7xl">
          <EventsGrid 
            events={filteredEvents} 
            loading={loading} 
            showAllEvents={false}
            setShowAllEvents={() => {}}
            searchQuery={searchQuery}
            onMarkDeleted={removeNonexistentEvent}
          />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
