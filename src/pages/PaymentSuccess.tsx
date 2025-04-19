
import { useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Check } from "lucide-react"

import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface PaymentSuccessState {
  eventName: string;
  total: number;
  paymentMethod: string;
  tickets: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const paymentData = location.state as PaymentSuccessState | null

  useEffect(() => {
    if (!paymentData) {
      navigate('/', { replace: true })
    }
  }, [paymentData, navigate])

  if (!paymentData) {
    return null
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit":
        return "Cartão de Crédito";
      case "debit":
        return "Cartão de Débito";
      case "pix":
        return "PIX";
      default:
        return method;
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-10 px-4 max-w-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-center">Pagamento Confirmado!</h1>
          <p className="text-gray-500 text-center mt-2">
            Seu pedido foi processado com sucesso.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Número do Pedido</span>
                <span className="font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data</span>
                <span className="font-medium">{formatDate(orderDate)}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{paymentData.eventName}</h3>
              <div className="space-y-2">
                {paymentData.tickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{ticket.name} × {ticket.quantity}</span>
                    <span>R$ {(ticket.price * ticket.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Forma de pagamento</span>
                <span>{getPaymentMethodName(paymentData.paymentMethod)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>R$ {paymentData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Um e-mail contendo os ingressos foi enviado para o seu endereço de e-mail.
              Você também pode acessá-los em "Meus Ingressos" na sua conta.
            </p>
            <div className="flex gap-4 w-full">
              <Button asChild variant="outline" className="w-1/2">
                <Link to="/">Voltar ao início</Link>
              </Button>
              <Button asChild className="w-1/2 bg-gradient-primary text-white hover:opacity-90">
                <Link to="/meus-ingressos">Meus Ingressos</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default PaymentSuccess
