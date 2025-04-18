
interface EventMapProps {
  coordinates: {
    lat: number
    lng: number
  }
}

const EventMap = ({ coordinates }: EventMapProps) => {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Mapa será implementado aqui</p>
    </div>
  )
}

export default EventMap
