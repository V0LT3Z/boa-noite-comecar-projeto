
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import FavoriteButton from "./FavoriteButton"
import { useEffect, useState } from "react"
import { fetchEventById } from "@/services/events"
import { toast } from "@/hooks/use-toast"

interface EventCardProps {
  id: number
  title: string
  date: string
  location: string
  image: string
  category?: string
  status?: string
}

const EventCard = ({ id, title, date, location, image, category, status }: EventCardProps) => {
  const [eventExists, setEventExists] = useState<boolean | null>(null);
  const [eventStatus, setEventStatus] = useState<string | undefined>(status);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    // Verificar se o evento existe apenas uma vez
    const checkEvent = async () => {
      if (eventExists !== null || isChecking) return;
      
      setIsChecking(true);
      try {
        const event = await fetchEventById(id);
        setEventExists(!!event);
        if (event) {
          setEventStatus(event.status);
        }
      } catch (error) {
        console.error("Erro ao verificar evento:", error);
        setEventExists(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkEvent();
    
    return () => {
      // Cleanup se necessário
    };
  }, [id, eventExists, isChecking]);
  
  const handleVerIngressos = () => {
    if (eventStatus === "cancelled") {
      toast({
        title: "Evento Cancelado",
        description: "Este evento foi cancelado e não está mais disponível para compra.",
        variant: "destructive",
      });
      return false;
    } else if (eventExists === false) {
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
    <Card className="overflow-hidden hover:shadow-event-card transition-shadow group relative">
      <div className="flex">
        <div className="w-48 h-32 relative flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-30 mix-blend-multiply" />
          
          {/* Adicionar badge de categoria */}
          {category && (
            <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs font-semibold text-primary font-gooddog">
              {category}
            </div>
          )}

          {/* Adicionar badge de status se for cancelado */}
          {eventStatus === "cancelled" && (
            <div className="absolute top-2 right-2 bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white font-gooddog">
              Cancelado
            </div>
          )}
          
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton eventId={id} variant="icon" />
          </div>
        </div>
        
        <div className="flex flex-1 items-center p-4 justify-between gap-4">
          <div className="space-y-2 flex-grow">
            <h3 className="font-bold text-xl text-primary line-clamp-2 font-gooddog">{title}</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-secondary" />
                <span className="truncate font-gooddog">{date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-secondary" />
                <span className="truncate font-gooddog">{location}</span>
              </div>
            </div>
          </div>
          
          <Link 
            to={`/evento/${id}`} 
            className="flex-shrink-0"
            onClick={(e) => {
              if (!handleVerIngressos()) {
                e.preventDefault();
              }
            }}
          >
            <Button 
              className={`${eventStatus === "cancelled" 
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"} text-white whitespace-nowrap font-gooddog`}
              disabled={eventStatus === "cancelled"}
            >
              {eventStatus === "cancelled" ? "Indisponível" : "Ver ingressos"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
