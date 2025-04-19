
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface OrderSummaryProps {
  orderData: {
    event: {
      id: number;
      title: string;
      date: string;
      time: string;
      location: string;
      image: string;
    };
    tickets: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>;
  };
}

const OrderSummary = ({ orderData }: OrderSummaryProps) => {
  const total = orderData.tickets.reduce(
    (sum, ticket) => sum + (ticket.price * ticket.quantity),
    0
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>{orderData.event.title}</CardDescription>
        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>{orderData.event.date} - {orderData.event.time}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderData.tickets.map((item, index) => (
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
