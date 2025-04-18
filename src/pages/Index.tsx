import { useState } from "react"
import Header from "@/components/Header"
import SearchBar from "@/components/SearchBar"
import EventCard from "@/components/EventCard"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const mockEvents = [
  {
    id: 1,
    title: "Festival de Música 2024",
    date: "20 Maio 2024",
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=500&fit=crop"
  },
  {
    id: 2,
    title: "Workshop de Tecnologia",
    date: "15 Junho 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Conferência de Inovação",
    date: "10 Julho 2024",
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Feira de Startups",
    date: "5 Agosto 2024",
    location: "Belo Horizonte, MG",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Dev Conference Brasil",
    date: "22 Setembro 2024",
    location: "Florianópolis, SC",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop"
  },
  {
    id: 6,
    title: "UX Design Summit",
    date: "12 Outubro 2024",
    location: "Porto Alegre, RS",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=500&fit=crop"
  }
]

const featuredEvents = [
  {
    id: 1,
    title: "Rock in Rio 2024",
    date: "Setembro 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Festival de Música 2024",
    date: "20 Maio 2024",
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Workshop de Tecnologia",
    date: "15 Junho 2024",
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Conferência de Inovação",
    date: "10 Julho 2024",
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop"
  }
]

const Index = () => {
  const [showAllEvents, setShowAllEvents] = useState(false)
  const displayedEvents = showAllEvents ? mockEvents : mockEvents.slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 space-y-8 py-8">
        <SearchBar />
        
        <Carousel className="relative rounded-2xl overflow-hidden">
          <CarouselContent>
            {featuredEvents.map((event) => (
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
          <h2 className="text-2xl font-semibold text-primary">Eventos</h2>
          <div className="flex flex-col gap-6">
            {displayedEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image={event.image}
              />
            ))}
          </div>
          {!showAllEvents && mockEvents.length > 3 && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => setShowAllEvents(true)}
                className="bg-gradient-primary text-white hover:opacity-90"
              >
                Ver mais eventos
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Index
