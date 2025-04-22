
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
}

const EventCard = ({ id, title, date, location, image, category }: EventCardProps) => {
  const [eventExists, setEventExists] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    // Verificar se o evento existe apenas quando o usuário passar o mouse sobre o botão
    const checkEvent = async () => {
      if (eventExists !== null || isChecking) return;
      
      setIsChecking(true);
      try {
        const event = await fetchEventById(id);
        setEventExists(!!event);
      } catch (error) {
        console.error("Erro ao verificar evento:", error);
        setEventExists(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    // Se tivermos eventos mockados, não precisamos verificar
    if (window.location.pathname === "/") {
      setEventExists(true);
    }
    
    return () => {
      // Cleanup se necessário
    };
  }, [id, eventExists, isChecking]);
  
  const handleVerIngressos = () => {
    if (eventExists === false) {
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
            <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs font-semibold text-primary">
              {category}
            </div>
          )}
          
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton eventId={id} variant="icon" />
          </div>
        </div>
        
        <div className="flex flex-1 items-center p-4 justify-between gap-4">
          <div className="space-y-2 flex-grow">
            <h3 className="font-bold text-xl text-primary line-clamp-2">{title}</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-secondary" />
                <span className="truncate">{date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-secondary" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
          
          {window.location.pathname === "/" ? (
            <Button 
              className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 whitespace-nowrap"
              onClick={() => {
                toast({
                  title: "Evento em Desenvolvimento",
                  description: "Este evento será disponibilizado em breve. Fique atento às atualizações!",
                  variant: "default",
                });
              }}
            >
              Ver ingressos
            </Button>
          ) : (
            <Link 
              to={`/evento/${id}`} 
              className="flex-shrink-0"
              onClick={(e) => {
                if (!handleVerIngressos()) {
                  e.preventDefault();
                }
              }}
            >
              <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 whitespace-nowrap">
                Ver ingressos
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

export default EventCard
