import Header from "@/components/Header"
import SearchBar from "@/components/SearchBar"
import EventCard from "@/components/EventCard"

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
  }
]

const featuredEvent = {
  title: "Rock in Rio 2024",
  date: "Setembro 2024",
  location: "Rio de Janeiro, RJ",
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop"
}

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="container mx-auto px-4 space-y-8">
        <SearchBar />
        
        <section className="relative rounded-2xl overflow-hidden group cursor-pointer">
          <img 
            src={featuredEvent.image} 
            alt={featuredEvent.title}
            className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-30 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-4xl font-bold text-white mb-2">{featuredEvent.title}</h2>
            <div className="flex items-center gap-4 text-white/90">
              <p>{featuredEvent.date}</p>
              <p>•</p>
              <p>{featuredEvent.location}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Eventos</h2>
          <div className="flex flex-col gap-6">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image={event.image}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Index
