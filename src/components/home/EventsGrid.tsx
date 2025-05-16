
import React from 'react';
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  status?: string;
}

interface EventsGridProps {
  loading: boolean;
  events: EventItem[];
  showAllEvents: boolean;
  setShowAllEvents: (show: boolean) => void;
  searchQuery: string | null;
  selectedCategory: string | null;
}

const EventsGrid = ({
  loading,
  events,
  showAllEvents,
  setShowAllEvents,
  searchQuery,
  selectedCategory
}: EventsGridProps) => {
  const displayedEvents = showAllEvents ? events : events.slice(0, 6);
  const hasSearchResults = searchQuery && events.length > 0;
  const noSearchResults = searchQuery && events.length === 0;

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {hasSearchResults 
            ? `Eventos encontrados (${events.length})`
            : selectedCategory 
              ? `Eventos de ${selectedCategory}` 
              : "Todos os Eventos"}
        </h2>
        {selectedCategory && (
          <Button 
            variant="outline" 
            onClick={() => setShowAllEvents(false)}
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
      ) : events.length > 0 ? (
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
          {!showAllEvents && events.length > 6 && (
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
  );
};

export default EventsGrid;
