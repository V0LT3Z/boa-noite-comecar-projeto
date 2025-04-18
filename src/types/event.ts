
export interface EventDetails {
  id: number
  title: string
  date: string
  time: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  image: string
  minimumAge: number
  tickets: TicketType[]
  warnings: string[]
}

export interface TicketType {
  id: number
  name: string
  price: number
  description?: string
  availableQuantity: number
  maxPerPurchase: number
}
