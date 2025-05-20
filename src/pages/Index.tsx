
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
import { useQuery } from "@tanstack/react-query";

// Imported refactored components
import EventsGrid from "@/components/home/EventsGrid";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { toast } = useToast();
  
  // Usar React Query para gerenciar o fetch e cache de eventos com configurações otimizadas
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(false),
    // Configuração otimizada para economia de banda
    staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar os dados desatualizados
    gcTime: 1000 * 60 * 10, // 10 minutos antes de remover os dados do cache
    refetchOnWindowFocus: false, // Não recarregar quando o usuário volta à janela
    retry: 1
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
  const removeNonexistentEvent = (eventId: number) => {
    // Precisamos apenas atualizar a UI, React Query cuidará da sincronização quando necessário
    console.log(`Evento ${eventId} marcado como removido`);
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
      
      return matchesSearch && !deletedEventIds.has(event.id) && event.status !== "cancelled";
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
