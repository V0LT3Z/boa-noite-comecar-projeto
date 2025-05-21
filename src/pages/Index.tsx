
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchEvents, syncDeletedEventsFromDatabase } from "@/services/events";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { getDeletedEventIds, isEventDeleted } from "@/services/utils/deletedEventsUtils";
import { useQuery } from "@tanstack/react-query";

// Imported refactored components
import EventsGrid from "@/components/home/EventsGrid";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { toast } = useToast();
  
  // Lista local para rastreamento de eventos excluídos durante a sessão
  const [locallyDeletedEvents, setLocallyDeletedEvents] = useState<Set<number>>(new Set());
  
  // Forçar sincronização de eventos excluídos ao carregar a página
  useEffect(() => {
    console.log("Sincronizando eventos excluídos ao carregar a página inicial");
    syncDeletedEventsFromDatabase().then(() => {
      // Após a sincronização, atualizar a lista local
      setLocallyDeletedEvents(new Set(getDeletedEventIds()));
    }).catch(error => {
      console.error("Erro ao sincronizar eventos excluídos:", error);
    });
    
    // Limpar caches potencialmente problemáticos
    const forceRefresh = Date.now().toString();
    localStorage.setItem('force_refresh_events', forceRefresh);
  }, []);
  
  // Usar React Query para gerenciar o fetch e cache de eventos com configurações otimizadas
  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events', localStorage.getItem('force_refresh_events')], // Incluir o timestamp para forçar nova consulta quando necessário
    queryFn: () => fetchEvents(true), // Force refresh on main page
    // Configuração otimizada para economia de banda
    staleTime: 1000 * 30, // 30 segundos antes de considerar os dados desatualizados (reduzido para evitar problemas)
    gcTime: 1000 * 60 * 5, // 5 minutos antes de remover os dados do cache
    refetchOnWindowFocus: true, // Recarregar quando o usuário volta à janela
    retry: 2
  });
  
  // Handle error separately with useEffect
  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Falha ao carregar eventos",
        description: "Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const handleSearch = (query: string) => {
    // Update URL with search query
    setSearchParams(query ? { q: query } : {});
  };

  // Remover um evento da UI se ele não existir mais no banco de dados
  const removeNonexistentEvent = useCallback((eventId: number) => {
    console.log(`Evento ${eventId} marcado como removido na UI`);
    setLocallyDeletedEvents(prev => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });
  }, []);

  const formattedEvents = useMemo(() => {
    // Filtrar eventos excluídos antes mesmo de formatar
    const currentDeletedIds = new Set([...getDeletedEventIds(), ...locallyDeletedEvents]);
    
    console.log("Formatando eventos. IDs excluídos:", Array.from(currentDeletedIds));
    
    const nonDeletedEvents = events.filter(event => {
      const isDeleted = 
        currentDeletedIds.has(event.id) || 
        event.status === "deleted" || 
        (event.title && event.title.includes("[DELETADO]"));
        
      if (isDeleted) {
        console.log(`Evento ${event.id} filtrado durante formatação por estar excluído`);
      }
      
      return !isDeleted;
    });
    
    console.log(`Formatando ${nonDeletedEvents.length} eventos após filtragem de exclusão. Total original: ${events.length}`);
    
    return nonDeletedEvents.map(event => {
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
  }, [events, locallyDeletedEvents]);

  const filteredEvents = useMemo(() => {
    // Get the current set of deleted event IDs
    const deletedIds = new Set([...getDeletedEventIds(), ...locallyDeletedEvents]);
    console.log("Filtrando eventos na página inicial, IDs excluídos:", Array.from(deletedIds));
    
    return formattedEvents.filter(event => {
      // Filter by search query if provided and ensure event is not deleted
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      // Check multiple deletion indicators
      const isDeleted = 
        deletedIds.has(event.id) || 
        event.status === "deleted" ||
        (typeof event.title === 'string' && event.title.includes("[DELETADO]")) ||
        isEventDeleted(event.id);  // Função melhorada para verificar exclusão
        
      const isCancelled = event.status === "cancelled";
      
      // Se está excluído, registrar para debugging
      if (isDeleted) {
        console.log(`Evento ${event.id} filtrado por estar excluído: título="${event.title}"`);
      }
      
      return matchesSearch && !isDeleted && !isCancelled;
    });
  }, [formattedEvents, searchQuery, locallyDeletedEvents]);
    
  // Eventos em destaque para o carrossel
  const featuredEvents = useMemo(() => {
    // Get the current set of deleted event IDs
    const deletedIds = new Set([...getDeletedEventIds(), ...locallyDeletedEvents]);
    
    const activeEvents = formattedEvents.filter(
      event => 
        event.status === "active" && 
        !deletedIds.has(event.id) && 
        !isEventDeleted(event.id) &&
        !(typeof event.title === 'string' && event.title.includes("[DELETADO]"))
    );
    return activeEvents.slice(0, 3);
  }, [formattedEvents, locallyDeletedEvents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20 flex flex-col font-gooddog">
      <Header />
      
      <main className="flex-1 pb-12">
        {/* Hero section com banner principal e informações - full width */}
        <div className="w-full">
          {!isLoading && filteredEvents.length > 0 && (
            <FeaturedCarousel events={featuredEvents} />
          )}
        </div>
        
        {/* Lista de eventos - constrained width */}
        <section className="mt-16 container mx-auto px-4 max-w-7xl">
          <EventsGrid 
            events={filteredEvents} 
            loading={isLoading} 
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
