
import Header from "@/components/Header"
import SearchBar from "@/components/SearchBar"
import CategoryCarousel from "@/components/CategoryCarousel"
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Encontre seus eventos favoritos
          </h1>
          <p className="text-lg text-gray-400">
            Descubra eventos incríveis acontecendo perto de você
          </p>
        </section>

        <SearchBar />
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Categorias em Destaque</h2>
          <CategoryCarousel />
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-primary">Eventos em Destaque</h2>
            <button className="text-secondary hover:text-secondary-light transition-colors">
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

