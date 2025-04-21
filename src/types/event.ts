
export interface EventDetails {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  coordinates?: {
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
  status: "active" | "paused" | "cancelled";
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  description?: string;
  availableQuantity: number;
  maxPerPurchase: number;
}

export interface EventResponse {
  id: number;
  title: string;
  date: string; // ISO string
  description: string | null;
  location: string;
  image_url: string | null;
  minimum_age: number | null;
  status: string | null;
  tickets_sold: number | null;
  total_tickets: number;
}

export interface TicketTypeResponse {
  id: number;
  name: string;
  price: number;
  description: string | null;
  available_quantity: number;
  max_per_purchase: number;
}

export interface UserTicket {
  id: number;
  event_id: number;
  event_title: string;
  event_date: string;
  event_location: string;
  ticket_type: string;
  qr_code: string;
  is_used: boolean;
}
