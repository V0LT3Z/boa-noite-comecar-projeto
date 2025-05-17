
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '@/components/EventCard';

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
  const navigate = useNavigate();
  
  // Se estiver carregando, mostra os skeletons
  if (loading) {
    return (
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10 w-full">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Se não há eventos para mostrar
  if (events.length === 0) {
    return (
      <div className="container px-4 mx-auto">
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
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

  // Limita o número de eventos exibidos para 12 (4 linhas de 3 cards)
  const displayEvents = events.slice(0, 12);

  const handleViewAllEvents = () => {
    navigate('/eventos');
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-left">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Eventos em Destaque"}
        </h2>
        <p className="text-muted-foreground text-sm mt-1 text-left">
          {searchQuery ? `${events.length} ${events.length === 1 ? 'evento encontrado' : 'eventos encontrados'}` : "Os mais procurados"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10 w-full">
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

      {events.length > 12 && (
        <div className="mt-12 text-center">
          <Button
            onClick={handleViewAllEvents}
            variant="outline"
            className="px-8 border-primary/30 text-primary hover:bg-primary/5"
          >
            Ver todos os eventos
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
