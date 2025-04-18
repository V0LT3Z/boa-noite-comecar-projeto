
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto">
        <SearchBar />
        <CategoryCarousel />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </main>
    </div>
  )
}

export default Index
