
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { fetchEvents } from "@/services/events";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import EventCard from "@/components/EventCard";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getDeletedEventIds } from "@/services/utils/deletedEventsUtils";
import { useQuery } from "@tanstack/react-query";

const AllEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Track locally deleted events
  const [locallyDeletedEvents, setLocallyDeletedEvents] = useState<number[]>([]);
  
  const { toast } = useToast();
  
  // Rolar para o topo da página quando o componente é montado
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get deleted events from localStorage
  useEffect(() => {
    try {
      const deletedIds = Array.from(getDeletedEventIds());
      console.log("Eventos previamente deletados:", deletedIds);
      setLocallyDeletedEvents(deletedIds);
    } catch (error) {
      console.error("Erro ao carregar eventos deletados:", error);
    }
  }, []);
  
  // Usar React Query para gerenciar o fetch de eventos
  const { 
    data: events = [], 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['all-events'],
    queryFn: () => fetchEvents(true), // Force refresh para garantir dados atualizados
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });
  
  // Handle errors
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
  
  // Function to mark an event as deleted locally
  const handleMarkDeleted = (id: number) => {
    console.log(`Marcando evento ${id} como excluído localmente`);
    
    // Update local state
    setLocallyDeletedEvents(prev => {
      const updated = [...prev, id];
      return updated;
    });
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
    // Obtenha a lista atual de IDs excluídos
    const deletedIds = Array.from(getDeletedEventIds());
    
    return formattedEvents.filter(event => {
      // Filter by search query if provided and remove deleted events
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const isDeleted = deletedIds.includes(event.id);
      const isCancelled = event.status === "cancelled";
      
      return matchesSearch && !isDeleted && !isCancelled;
    });
  }, [formattedEvents, searchQuery]);

  // Renderização do esqueleto durante o carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white/80 to-soft-purple/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[...Array(6)].map((_, index) => (
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
