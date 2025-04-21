
import { useState, useEffect } from "react"
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

const mockEvents = [
  {
    id: 1,
    title: "Festival de Música 2024",
    date: "20 Maio 2024",
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=500&fit=crop",
    category: "Música"
  },
  {
    id: 2,
    title: "Workshop de Tecnologia",
    date: "15 Junho 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
    category: "Workshops"
  },
  {
    id: 3,
    title: "Conferência de Inovação",
    date: "10 Julho 2024",
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    category: "Congressos"
  },
  {
    id: 4,
    title: "Feira de Startups",
    date: "5 Agosto 2024",
    location: "Belo Horizonte, MG",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop",
    category: "Workshops"
  },
  {
    id: 5,
    title: "Dev Conference Brasil",
    date: "22 Setembro 2024",
    location: "Florianópolis, SC",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    category: "Congressos"
  },
  {
    id: 6,
    title: "UX Design Summit",
    date: "12 Outubro 2024",
    location: "Porto Alegre, RS",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=500&fit=crop",
    category: "Congressos"
  }
]

const featuredEvents = [
  {
    id: 1,
    title: "Rock in Rio 2024",
    date: "Setembro 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop",
    category: "Música"
  },
  {
    id: 2,
    title: "Festival de Música 2024",
    date: "20 Maio 2024",
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=400&fit=crop",
    category: "Música"
  },
  {
    id: 3,
    title: "Workshop de Tecnologia",
    date: "15 Junho 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop",
    category: "Workshops"
  },
  {
    id: 4,
    title: "Conferência de Inovação",
    date: "10 Julho 2024",
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop",
    category: "Congressos"
  }
]

const Index = () => {
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [events, setEvents] = useState<EventResponse[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventData = await fetchEvents();
        console.log("Eventos carregados:", eventData);
        
        // Se não houver eventos do banco, usar os mockados
        if (!eventData || eventData.length === 0) {
          console.log("Usando eventos mockados pois não há eventos no banco");
          setEvents(mockEvents as unknown as EventResponse[]);
        } else {
          setEvents(eventData);
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        // Usar dados mockados em caso de falha
        console.log("Usando eventos mockados devido a erro");
        setEvents(mockEvents as unknown as EventResponse[]);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  const formattedEvents = events.map(event => {
    // Se for um evento mockado, use seu formato diretamente
    if ('category' in event) {
      return event as unknown as {
        id: number;
        title: string;
        date: string;
        location: string;
        image: string;
        category: string;
      };
    }
    
    // Se for um evento do banco, formate os dados
    try {
      const eventDate = new Date(event.date);
      return {
        id: event.id,
        title: event.title,
        date: format(eventDate, "dd 'de' MMMM yyyy", { locale: ptBR }),
        location: event.location,
        image: event.image_url || "https://picsum.photos/seed/" + event.id + "/800/500",
        category: "Eventos"
      };
    } catch (error) {
      console.error("Erro ao formatar evento:", error, event);
      return {
        id: event.id || 0,
        title: event.title || "Evento sem título",
        date: "Data não disponível",
        location: event.location || "Local não informado",
        image: "https://picsum.photos/seed/fallback/800/500",
        category: "Eventos"
      };
    }
  });

  const filteredEvents = selectedCategory 
    ? formattedEvents.filter(event => event.category === selectedCategory)
    : formattedEvents;
    
  const displayedEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 3)

  const filteredFeaturedEvents = selectedCategory 
    ? featuredEvents.filter(event => event.category === selectedCategory)
    : featuredEvents;

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
            <SearchBar />
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
        <Carousel className="relative rounded-2xl overflow-hidden">
          <CarouselContent>
            {filteredFeaturedEvents.map((event) => (
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

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-primary">
              {selectedCategory ? `Eventos de ${selectedCategory}` : "Todos os Eventos"}
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
          ) : formattedEvents.length > 0 ? (
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
                  />
                ))}
              </div>
              {!showAllEvents && filteredEvents.length > 3 && (
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
                Nenhum evento encontrado para esta categoria.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Index
