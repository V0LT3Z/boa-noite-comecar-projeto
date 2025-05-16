
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '@/components/EventCard';
import { Separator } from '@/components/ui/separator';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  status?: string;
}

interface EventsGridProps {
  events: EventItem[];
  loading: boolean;
  showAllEvents: boolean;
  setShowAllEvents: (value: boolean) => void;
  searchQuery: string;
}

const EventsGrid = ({
  events,
  loading,
  showAllEvents,
  setShowAllEvents,
  searchQuery
}: EventsGridProps) => {
  // Se estiver carregando, mostra os skeletons
  if (loading) {
    return (
      <div>
        <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 w-full my-8" />
        <h2 className="text-2xl font-bold mb-6">Eventos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-3/4 h-4 mt-4" />
              <Skeleton className="w-1/2 h-4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Se não há eventos para mostrar
  if (events.length === 0) {
    return (
      <div>
        <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 w-full my-8" />
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">Nenhum evento encontrado</h2>
              <p className="text-muted-foreground mb-6">
                Não encontramos eventos relacionados a "{searchQuery}"
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">Nenhum evento disponível</h2>
              <p className="text-muted-foreground mb-6">
                No momento não há eventos cadastrados.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Limita o número de eventos exibidos, a menos que showAllEvents seja true
  const displayEvents = showAllEvents ? events : events.slice(0, 8);

  return (
    <div>
      <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 w-full my-8" />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os eventos"}
        </h2>
        <div className="flex gap-4">
          {/* Outros filtros podem ser adicionados aqui */}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayEvents.map(event => (
          <Link key={event.id} to={`/evento/${event.id}`}>
            <EventCard
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              image={event.image}
              status={event.status}
            />
          </Link>
        ))}
      </div>

      {events.length > 8 && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => setShowAllEvents(!showAllEvents)}
            variant="outline"
            className="px-8"
          >
            {showAllEvents ? "Mostrar menos" : `Ver mais ${events.length - 8} eventos`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
