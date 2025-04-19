
export interface EventDetails {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  image: string;
  minimumAge: number;
  tickets: TicketType[];
  warnings: string[];
  venue: {
    name: string;
    address: string;
    capacity: number;
    map_url: string;
  };
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  description?: string;
  availableQuantity: number;
  maxPerPurchase: number;
}
