
import { MapPin } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface EventMapProps {
  coordinates: Coordinates;
}

const EventMap = ({ coordinates }: EventMapProps) => {
  return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border relative overflow-hidden">
      <div className="absolute inset-0 bg-soft-gray opacity-50"></div>
      <div className="flex flex-col items-center justify-center z-10">
        <MapPin className="h-8 w-8 text-primary mb-2" />
        <p className="text-gray-700 font-medium font-gooddog">
          Mapa em {coordinates.lat}, {coordinates.lng}
        </p>
      </div>
    </div>
  );
};

export default EventMap;
