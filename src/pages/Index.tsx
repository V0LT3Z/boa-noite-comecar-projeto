
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { fetchEvents } from "@/services/events";
import { EventResponse } from "@/types/event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

// Imported refactored components
import EventsGrid from "@/components/home/EventsGrid";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const { toast } = useToast();
  
  // Função para gerar eventos genéricos
  const generateGenericEvents = (): EventResponse[] => {
    const eventTitles = [
      "Festival de Música Indie",
      "Workshop de Fotografia",
      "Feira Gastronômica Internacional",
      "Conferência de Tecnologia",
      "Exposição de Arte Contemporânea",
      "Show de Comédia Stand-up",
      "Maratona Beneficente",
      "Feira de Livros",
      "Palestra sobre Sustentabilidade",
      "Festival de Cinema",
      "Concerto Sinfônico",
      "Curso de Culinária",
      "Campeonato de E-Sports",
      "Feira de Empreendedorismo",
      "Workshop de Marketing Digital",
      "Congresso de Medicina",
      "Festival de Teatro",
      "Encontro de Networking"
    ];
    
    const locations = [
      "São Paulo, SP",
      "Rio de Janeiro, RJ",
      "Belo Horizonte, MG",
      "Porto Alegre, RS",
      "Florianópolis, SC",
      "Salvador, BA",
      "Recife, PE",
      "Fortaleza, CE"
    ];
    
    const now = new Date();
    
    // Criar 18 eventos genéricos
    return eventTitles.map((title, index) => ({
      id: index + 1,
      title: title,
      description: `Descrição do evento ${title}`,
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + index).toISOString(),
      location: locations[index % locations.length],
      price: Math.floor(Math.random() * 200) + 50,
      capacity: 100,
      tickets_sold: Math.floor(Math.random() * 50),
      status: index % 10 === 0 ? "cancelled" : "active", // A cada 10 eventos, um é cancelado
      event_type: "presential",
      created_at: new Date().toISOString(),
      image_url: `https://picsum.photos/seed/event${index}/800/500`,
      user_id: "1",
      organizer: "Organizador de Eventos",
    }));
  };

  const loadEvents = useCallback(async () => {
    if (eventsLoaded) return; // Evita múltiplas chamadas se os eventos já foram carregados
    
    try {
      setLoading(true);
      
      // Primeiro tenta carregar do banco de dados
      let eventData = await fetchEvents();
      console.log("Eventos carregados do banco:", eventData?.length || 0);
      
      // Se não houver eventos suficientes no banco, adiciona eventos genéricos
      if (!eventData || eventData.length < 15) {
        const genericEvents = generateGenericEvents();
        eventData = genericEvents;
        console.log("Usando eventos genéricos:", genericEvents.length);
      }
      
      if (!eventData || eventData.length === 0) {
        setEvents([]);
        console.log("Nenhum evento encontrado");
        
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
        console.log("Eventos ativos:", activeEvents.length);
        setEvents(eventData); // Agora mantendo todos os eventos, incluindo cancelados, para teste
      }
      
      setEventsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      
      // Usar eventos genéricos em caso de erro
      const genericEvents = generateGenericEvents();
      setEvents(genericEvents);
      console.log("Usando eventos genéricos após erro:", genericEvents.length);
      
      toast({
        title: "Falha ao carregar eventos",
        description: "Ocorreu um erro ao carregar os eventos. Usando dados de demonstração.",
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
    
  // Eventos em destaque para o carrossel
  const featuredEvents = useMemo(() => {
    const activeEvents = formattedEvents.filter(event => event.status === "active");
    console.log("Eventos para o carrossel:", activeEvents.length);
    
    return activeEvents.slice(0, 5);
  }, [formattedEvents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20">
      <Header />
      
      <main className="pb-12">
        {/* Hero section com banner principal e informações - full width */}
        <div className="w-full">
          {!loading && featuredEvents.length > 0 && (
            <FeaturedCarousel events={featuredEvents} />
          )}
        </div>
        
        {/* Lista de eventos - constrained width */}
        {!loading && (
          <section className="mt-16 container mx-auto px-4 max-w-7xl">
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
  );
}

export default Index;
