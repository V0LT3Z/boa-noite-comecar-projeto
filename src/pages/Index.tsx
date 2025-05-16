import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams, Link } from "react-router-dom"
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
      
      {/* Área de busca com gradiente */}
      <section className="relative bg-gradient-to-r from-purple-100 to-blue-100 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
          <div className="absolute right-10 top-40 w-60 h-60 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
          <div className="absolute left-1/2 bottom-0 w-80 h-80 rounded-full bg-pink-300 opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <img 
                src="/lovable-uploads/efc2028f-817a-4367-bfd1-0e95034651dc.png" 
                alt="NOKTA TICKETS" 
                className="h-24"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-5">
              Encontre eventos para você
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Shows, festivais, workshops e muito mais
            </p>
            <SearchBar 
              onSearch={handleSearch} 
              defaultQuery={searchQuery}
              suggestions={searchSuggestions}
            />
            <div className="mt-6">
              <CategoryCarousel 
                selectedCategory={selectedCategory} 
                onCategorySelect={setSelectedCategory} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal com fundo claro */}
      <main className="container mx-auto px-4 space-y-12 mt-12 mb-20">
        {searchQuery && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
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
          <div className="relative">
            <Carousel className="relative overflow-hidden rounded-3xl shadow-xl">
              <CarouselContent>
                {carouselEvents.map((event) => (
                  <CarouselItem key={event.id} className="cursor-pointer">
                    <Link to={`/evento/${event.id}`}>
                      <div className="relative group h-[450px]">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 mix-blend-multiply" />
                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent">
                          <span className="inline-block px-4 py-1 bg-primary/80 text-white text-sm rounded-full mb-4">
                            Em destaque
                          </span>
                          <h2 className="text-4xl font-bold text-white mb-3">{event.title}</h2>
                          <div className="flex items-center gap-4 text-white/90">
                            <p className="font-medium">{event.date}</p>
                            <p>•</p>
                            <p>{event.location}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-6 bg-white/90 hover:bg-white" />
              <CarouselNext className="right-6 bg-white/90 hover:bg-white" />
            </Carousel>
          </div>
        )}

        <section className="relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {hasSearchResults 
                ? `Eventos encontrados (${filteredEvents.length})`
                : selectedCategory 
                  ? `Eventos de ${selectedCategory}` 
                  : "Todos os Eventos"}
            </h2>
            {selectedCategory && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
                className="text-primary hover:text-primary/80 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              >
                Ver todos
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-center mt-10">
                  <Button 
                    onClick={() => setShowAllEvents(true)}
                    className="text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 px-8 py-6 text-lg rounded-full"
                  >
                    Ver mais eventos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center bg-white rounded-3xl shadow-sm border border-purple-100">
              <p className="text-muted-foreground text-lg">
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
