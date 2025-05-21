
import { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { fetchEventById } from "@/services/events";
import { toast } from "@/hooks/use-toast";
import { isEventDeleted } from "@/services/utils/deletedEventsUtils";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  category?: string;
  status?: string;
  onMarkDeleted?: (id: number) => void;
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  location, 
  image, 
  category, 
  status,
  onMarkDeleted = () => {}
}: EventCardProps) => {
  const [eventExists, setEventExists] = useState<boolean | null>(null);
  const [eventStatus, setEventStatus] = useState<string | undefined>(status);
  const [isChecking, setIsChecking] = useState(false);
  
  // Verificação imediata - antes mesmo de qualquer renderização
  if (isEventDeleted(id) || status === "deleted") {
    console.log(`[EventCard] Evento ${id} está excluído, cancelando renderização`);
    return null;
  }
  
  // Verificação de título com marcador de exclusão
  if (title.includes("[DELETADO]")) {
    console.log(`[EventCard] Evento ${id} tem título com marca de exclusão: ${title}, cancelando renderização`);
    if (onMarkDeleted) onMarkDeleted(id);
    return null;
  }
  
  useEffect(() => {
    // Verificação mais agressiva com verificação dupla
    const checkEvent = async () => {
      if (eventExists !== null || isChecking) return;
      
      try {
        setIsChecking(true);
        
        // Verificação no localStorage
        if (isEventDeleted(id)) {
          console.log(`[EventCard effect] Evento ${id} está excluído no localStorage, não será exibido`);
          setEventExists(false);
          if (onMarkDeleted) {
            onMarkDeleted(id);
          }
          return;
        }
        
        // Verificação de status local
        if (status === "deleted") {
          console.log(`[EventCard effect] Evento ${id} tem status local 'deleted', não será exibido`);
          setEventExists(false);
          if (onMarkDeleted) {
            onMarkDeleted(id);
          }
          return;
        }
        
        // Verificação do título local
        if (title.includes("[DELETADO]")) {
          console.log(`[EventCard effect] Evento ${id} tem título local com marca de exclusão: ${title}`);
          setEventExists(false);
          if (onMarkDeleted) {
            onMarkDeleted(id);
          }
          return;
        }
        
        // Verificar com o servidor para ter certeza
        const event = await fetchEventById(id);
        
        if (!event) {
          console.log(`[EventCard effect] Evento ${id} não existe no banco de dados`);
          setEventExists(false);
          if (onMarkDeleted) {
            onMarkDeleted(id);
          }
          return;
        }
        
        // Se o evento existe mas foi excluído no banco de dados, marcar como inexistente
        if (event.status === "deleted" || (event.title && event.title.includes("[DELETADO]"))) {
          console.log(`[EventCard effect] Evento ${id} tem status 'deleted' ou título marcado como excluído no banco`);
          setEventExists(false);
          if (onMarkDeleted) {
            onMarkDeleted(id);
          }
          return;
        }
        
        console.log(`[EventCard effect] Evento ${id} encontrado com status: ${event.status}`);
        setEventExists(true);
        setEventStatus(event.status);
      } catch (error) {
        console.error(`Erro ao verificar evento ${id}:`, error);
        // Não marcar como excluído em caso de erro, manter exibindo
        setEventExists(true);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkEvent();
  }, [id, eventExists, isChecking, onMarkDeleted, status, title]);
  
  // Se o evento não existe ou está excluído, não renderizar o card
  if (eventExists === false) {
    console.log(`[EventCard render] Não renderizando card para evento ${id} (não existe ou foi excluído)`);
    return null;
  }
  
  // Verificação adicional imediata de eventos excluídos
  if (isEventDeleted(id) || status === "deleted" || title.includes("[DELETADO]")) {
    console.log(`[EventCard render 2] Evento ${id} está na lista de excluídos local, não será exibido`);
    return null;
  }
  
  const handleVerIngressos = () => {
    if (eventStatus === "cancelled" || eventStatus === "deleted") {
      toast({
        title: eventStatus === "cancelled" ? "Evento Cancelado" : "Evento Indisponível",
        description: eventStatus === "cancelled" 
          ? "Este evento foi cancelado e não está mais disponível para compra." 
          : "Este evento não está mais disponível.",
        variant: "destructive",
      });
      return false;
    } else if (eventExists === null || !eventExists) {
      toast({
        title: "Evento em Desenvolvimento",
        description: "Este evento será disponibilizado em breve. Fique atento às atualizações!",
        variant: "default",
      });
      return false;
    }
    return true;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-event-card transition-shadow duration-300 group relative h-full transform hover:-translate-y-1">
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback para imagem padrão em caso de erro
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${id || 'fallback'}/800/500`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 mix-blend-multiply" />
          
          {/* Category badge */}
          {category && (
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
              {category}
            </div>
          )}
          
          {/* Status badge - if cancelled */}
          {eventStatus === "cancelled" && (
            <div className="absolute top-3 right-12 bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              Cancelado
            </div>
          )}
          
          {/* Favorite button */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton eventId={id} variant="icon" />
          </div>
          
          {/* Date block with semi-transparent background, blur effect, and discrete border */}
          <div className="absolute bottom-0 left-0 bg-black/30 text-white px-3 py-1.5 font-medium flex items-center gap-1.5 rounded-tr-lg backdrop-blur-md border border-white/10">
            <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="text-xs">{date}</span>
          </div>
        </div>
        
        {/* Card body */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-black mb-2 line-clamp-2 h-14 text-left">{title}</h3>
          
          <div className="flex items-center gap-1 text-sm text-black mb-4">
            <MapPin className="h-4 w-4 min-w-4 text-secondary" />
            <span className="truncate">{location}</span>
          </div>
          
          <Link 
            to={`/evento/${id}`} 
            onClick={(e) => {
              if (!handleVerIngressos()) {
                e.preventDefault();
              }
            }}
            className="block w-full"
          >
            <Button 
              className={`w-full relative overflow-hidden bg-white text-primary border border-primary/30 hover:bg-gradient-primary hover:text-white transition-all duration-300 ${
                eventStatus === "cancelled" ? "bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-100" : ""
              }`}
              disabled={eventStatus === "cancelled"}
            >              
              {/* Button text */}
              <span className="relative z-10">
                {eventStatus === "cancelled" ? "Indisponível" : "Ver ingressos"}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default EventCard;
