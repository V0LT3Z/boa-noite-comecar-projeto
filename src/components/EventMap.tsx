
interface Coordinates {
  lat: number;
  lng: number;
}

interface EventMapProps {
  coordinates: Coordinates;
}

const EventMap = ({ coordinates }: EventMapProps) => {
  return (
    <div className="w-full h-64 mt-6 bg-gray-100 flex items-center justify-center rounded-lg border">
      <p className="text-gray-500">
        Mapa em {coordinates.lat}, {coordinates.lng}
      </p>
    </div>
  );
};

export default EventMap;
