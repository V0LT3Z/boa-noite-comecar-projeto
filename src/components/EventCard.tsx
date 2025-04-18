
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {date}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {location}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Ver ingressos</Button>
      </CardFooter>
    </Card>
  )
}

export default EventCard
