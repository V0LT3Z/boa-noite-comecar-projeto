import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import Header from "@/components/Header"
import SearchBar from "@/components/SearchBar"
import EventCard from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import CategoryCarousel from "@/components/CategoryCarousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { fetchEvents } from "@/services/events"
import { EventResponse } from "@/types/event"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<EventResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoaded, setEventsLoaded] = useState(false)
  const { toast } = useToast()
  
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
        setEvents(eventData);
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
      // Filter by category if selected
      const matchesCategory = selectedCategory 
        ? event.category === selectedCategory
        : true;
      
      // Filter by search query if provided
      const matchesSearch = searchQuery 
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesCategory && matchesSearch;
    });
  }, [formattedEvents, selectedCategory, searchQuery]);
    
  const displayedEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 6);
  
  const hasSearchResults = searchQuery && filteredEvents.length > 0;
  const noSearchResults = searchQuery && filteredEvents.length === 0;

  const searchSuggestions = useMemo(() => {
    return formattedEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location
    }));
  }, [formattedEvents]);

  const carouselEvents = filteredEvents.filter(event => event.status !== "cancelled").slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="relative bg-soft-gray pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 text-center">
              Encontre eventos para você
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Shows, festivais, workshops e muito mais
            </p>
            <SearchBar 
              onSearch={handleSearch} 
              defaultQuery={searchQuery}
              suggestions={searchSuggestions}
            />
            <div className="mt-4">
              <CategoryCarousel 
                selectedCategory={selectedCategory} 
                onCategorySelect={setSelectedCategory} 
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 space-y-10 mt-10">
        {searchQuery && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary">
              {noSearchResults 
                ? `Não encontramos resultados para "${searchQuery}"` 
                : `Resultados para "${searchQuery}"`}
            </h2>
            {noSearchResults && (
              <p className="text-muted-foreground mt-2">
                Tente buscar por termos diferentes ou navegue pelos eventos abaixo.
              </p>
            )}
          </div>
        )}
      
        {formattedEvents.length > 0 && !noSearchResults && !loading && carouselEvents.length > 0 && (
          <Carousel className="relative rounded-2xl overflow-hidden">
            <CarouselContent>
              {carouselEvents.map((event) => (
                <CarouselItem key={event.id} className="cursor-pointer">
                  <div className="relative group">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-50 mix-blend-multiply" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
                      <h2 className="text-4xl font-bold text-white mb-2">{event.title}</h2>
                      <div className="flex items-center gap-4 text-white/90">
                        <p>{event.date}</p>
                        <p>•</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-primary">
              {hasSearchResults 
                ? `Eventos encontrados (${filteredEvents.length})`
                : selectedCategory 
                  ? `Eventos de ${selectedCategory}` 
                  : "Todos os Eventos"}
            </h2>
            {selectedCategory && (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="text-primary hover:text-primary/80"
              >
                Ver todos
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="flex flex-col gap-6">
                {displayedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    image={event.image}
                    category={event.category}
                    status={event.status}
                  />
                ))}
              </div>
              {!showAllEvents && filteredEvents.length > 6 && (
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={() => setShowAllEvents(true)}
                    className="bg-gradient-primary text-white hover:opacity-90"
                  >
                    Ver mais eventos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                {noSearchResults 
                  ? "Tente ajustar sua busca para encontrar eventos."
                  : "Nenhum evento encontrado para esta categoria."}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Index
