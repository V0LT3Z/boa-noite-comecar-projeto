import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CreditCard, Wallet, Tag, MessageCircleQuestion } from "lucide-react"

import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/sonner"
import { useAuth } from "@/contexts/AuthContext"
import OrderSummary from "@/components/checkout/OrderSummary"
import CardForm from "@/components/checkout/CardForm"
import PixQRCode from "@/components/checkout/PixQRCode"

interface CheckoutState {
  eventDetails: EventDetails;
  selectedTickets: Record<number, number>;
}

const paymentSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["credit", "debit", "pix"])
})

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [checkoutData, setCheckoutData] = useState<CheckoutState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)

  const validCoupons = {
    "EVENTO10": 10, // 10% de desconto
    "PROMO20": 20,  // 20% de desconto
    "VIP30": 30     // 30% de desconto
  }

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      couponCode: "",
      paymentMethod: "credit"
    }
  });

  useEffect(() => {
    setShowPixQR(form.watch("paymentMethod") === "pix");
  }, [form.watch("paymentMethod")]);

  useEffect(() => {
    const state = location.state as CheckoutState | null
    
    if (!state || !state.eventDetails || !state.selectedTickets) {
      navigate('/', { replace: true })
      toast({
        title: "Erro",
        description: "Informações do evento não encontradas",
        variant: "destructive"
      })
      return
    }
    
    setCheckoutData(state)
  }, [location, navigate])

  const calculateTotal = () => {
    if (!checkoutData) return 0
    
    const { eventDetails, selectedTickets } = checkoutData
    let total = Object.entries(selectedTickets).reduce((acc, [ticketId, quantity]) => {
      const ticket = eventDetails.tickets.find(t => t.id === parseInt(ticketId))
      return acc + (ticket ? ticket.price * quantity : 0)
    }, 0)

    if (discount > 0) {
      total = total * (1 - discount / 100)
    }

    return total
  }

  const getTicketCountByType = () => {
    if (!checkoutData) return []
    
    const { eventDetails, selectedTickets } = checkoutData
    return Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => {
        const ticket = eventDetails.tickets.find(t => t.id === parseInt(ticketId))
        return {
          name: ticket?.name || "",
          price: ticket?.price || 0,
          quantity
        }
      })
  }

  const handleApplyCoupon = () => {
    const couponCode = form.getValues("couponCode")
    
    if (!couponCode) {
      toast({
        title: "Erro",
        description: "Digite um cupom para aplicar",
        variant: "destructive"
      })
      return
    }

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setDiscount(validCoupons[couponCode as keyof typeof validCoupons])
      setCouponApplied(true)
      toast({
        title: "Cupom aplicado",
        description: `Desconto de ${validCoupons[couponCode as keyof typeof validCoupons]}% aplicado`,
        type: "success"
      })
    } else {
      toast({
        title: "Erro",
        description: "Cupom inválido ou expirado",
        variant: "destructive"
      })
    }
  }

  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true)
    
    try {
      console.log("Dados do formulário:", data)
      console.log("Dados do checkout:", checkoutData)
      console.log("Total a pagar:", calculateTotal().toFixed(2))
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      navigate('/pagamento-sucesso', {
        state: {
          eventName: checkoutData?.eventDetails.title,
          total: calculateTotal(),
          paymentMethod: data.paymentMethod,
          tickets: getTicketCountByType()
        }
      })
    } catch (error) {
      console.error("Erro no processamento do pagamento:", error)
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    if (!value) return "";
    const cardNumberChunks = [];
    for (let i = 0; i < value.length; i += 4) {
      cardNumberChunks.push(value.slice(i, i + 4));
    }
    return cardNumberChunks.join(' ').trim().slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    if (!value) return "";
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    if (value.length > 2) {
      return `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    return value;
  };

  const formatCVC = (value: string) => {
    return value.slice(0, 3); // CVC is typically 3 digits
  }

  if (!checkoutData) {
    return <div className="container mx-auto p-4">Carregando informações do pedido...</div>
  }

  const { eventDetails } = checkoutData
  const ticketItems = getTicketCountByType()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-primary mb-6">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <OrderSummary 
              eventDetails={eventDetails}
              ticketItems={ticketItems}
              discount={discount}
              total={total}
            />
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Pagamento</CardTitle>
                <CardDescription>Preencha os dados para finalizar sua compra</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="couponCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cupom de Desconto</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  placeholder="Digite seu cupom" 
                                  {...field} 
                                  disabled={couponApplied}
                                />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleApplyCoupon}
                                disabled={couponApplied}
                              >
                                <Tag className="mr-2 h-4 w-4" />
                                {couponApplied ? "Aplicado" : "Aplicar"}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Método de Pagamento</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="credit" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Cartão de Crédito
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="debit" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Cartão de Débito
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="pix" />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <Wallet className="h-4 w-4" />
                                    Pix
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {(form.watch("paymentMethod") === "credit" || form.watch("paymentMethod") === "debit") && (
                        <CardForm form={form} />
                      )}
                      
                      {form.watch("paymentMethod") === "pix" && (
                        <PixQRCode total={total} />
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                      <MessageCircleQuestion className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Tem algum problema?</p>
                        <p className="text-sm text-blue-700">Entre em contato conosco para ajudar você</p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary text-white hover:opacity-90"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Finalizar Compra"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 text-center w-full">
                  Pagamento processado com segurança. Seus dados estão protegidos.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Checkout
