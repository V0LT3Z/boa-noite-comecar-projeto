
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import { EventDetails } from "@/types/event"

interface OrderSummaryProps {
  eventDetails: EventDetails;
  ticketItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  discount: number;
  total: number;
}

const OrderSummary = ({ eventDetails, ticketItems, discount, total }: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>{eventDetails.title}</CardDescription>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>{eventDetails.date} - {eventDetails.time}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ticketItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p>R$ {item.price.toFixed(2)}</p>
                <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <p>Desconto:</p>
              <p>-{discount}%</p>
            </div>
          )}
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>R$ {total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderSummary
