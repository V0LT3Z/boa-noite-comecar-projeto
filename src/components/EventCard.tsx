
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface EventCardProps {
  title: string
  date: string
  location: string
  image: string
}

const EventCard = ({ title, date, location, image }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-event-card transition-shadow group">
      <CardHeader className="p-0 relative">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-30 mix-blend-multiply"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-white dark:bg-gray-900">
        <h3 className="font-bold text-xl mb-2 text-primary dark:text-primary-light">{title}</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-secondary" />
            {date}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-secondary" />
            {location}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-white dark:bg-gray-900">
        <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
          Ver ingressos
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EventCard
