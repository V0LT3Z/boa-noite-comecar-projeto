
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EventCardProps {
  title: string
  date: string
  location: string
  image: string
}

const EventCard = ({ title, date, location, image }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-event-card transition-shadow group">
      <div className="flex">
        <div className="w-48 h-32 relative flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-30 mix-blend-multiply" />
        </div>
        
        <div className="flex flex-1 items-center p-4 justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-primary">{title}</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-secondary" />
                {date}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-secondary" />
                {location}
              </div>
            </div>
          </div>
          
          <Button className="bg-gradient-primary text-white hover:opacity-90 whitespace-nowrap">
            Ver ingressos
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
