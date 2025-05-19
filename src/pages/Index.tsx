
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Imported refactored components
import EventsGrid from "@/components/home/EventsGrid";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Simplified event loading with optimized state handling
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Carregando eventos...");
        const eventData = await fetchEvents();
        
        if (!eventData || eventData.length === 0) {
          setEvents([]);
          console.log("Nenhum evento encontrado no banco de dados");
          
          toast({
            title: "Nenhum evento disponível",
            description: "Ainda não há eventos disponíveis. Os produtores podem criar novos eventos na área administrativa.",
            variant: "default",
          });
        } else {
          // Filter out cancelled and removed events
          const activeEvents = eventData.filter(event => 
            event.status === "active" && event.id
          );
          
          console.log("Eventos ativos:", activeEvents.length);
          setEvents(activeEvents);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setError("Falha ao carregar eventos. Tente novamente mais tarde.");
        
        toast({
          title: "Falha ao carregar eventos",
          description: "Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
    
    // Set up an interval to refresh event data periodically
    const refreshInterval = setInterval(loadEvents, 60000);
    return () => clearInterval(refreshInterval);
  }, [toast]);
  
  const handleSearch = (query: string) => {
    setSearchParams(query ? { q: query } : {});
  };

  const formattedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events.map(event => {
      try {
        const eventDate = new Date(event.date);
        return {
          id: event.id,
          title: event.title,
          date: format(eventDate, "dd 'de' MMMM yyyy", { locale: ptBR }),
          location: event.location || "Local não informado",
          image: event.image_url || "https://picsum.photos/seed/" + event.id + "/800/500",
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
    if (!formattedEvents || formattedEvents.length === 0) return [];
    
    return formattedEvents.filter(event => {
      // Filter by search query if provided
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      // Somente mostrar eventos ativos
      return matchesSearch && event.status === "active";
    });
  }, [formattedEvents, searchQuery]);
    
  // Eventos em destaque para o carrossel - limite para 3 para economizar memória
  const featuredEvents = useMemo(() => {
    const activeEvents = formattedEvents.filter(event => event.status === "active");
    console.log("Eventos para o carrossel:", activeEvents.length);
    
    return activeEvents.slice(0, 3);
  }, [formattedEvents]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20 flex flex-col font-gooddog">
        <HeaderWrapper />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20 flex flex-col font-gooddog">
        <HeaderWrapper />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center max-w-lg mx-auto p-6">
            <p className="text-lg text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20 flex flex-col font-gooddog">
      <HeaderWrapper />
      
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
          />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default Index;
