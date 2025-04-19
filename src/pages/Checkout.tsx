import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CreditCard, Wallet, Tag, Info, MessageCircleQuestion } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TicketType, EventDetails } from "@/types/event"
import { toast } from "@/components/ui/sonner"
import { useAuth } from "@/contexts/AuthContext"

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
  const [showPixQR, setShowPixQR] = useState(false)

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

  if (!checkoutData) {
    return <div className="container mx-auto p-4">Carregando informações do pedido...</div>
  }

  const { eventDetails } = checkoutData
  const ticketItems = getTicketCountByType()
  const total = calculateTotal()

  const pixQRCodeURL = `https://chart.googleapis.com/chart?cht=qr&chl=00020126330014BR.GOV.BCB.PIX0111EXAMPLE1234520400005303986540${total.toFixed(2).replace('.', '')}5802BR5913EventPayment6008Sao Paulo62070503***6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}&chs=300x300&choe=UTF-8&chld=L|2`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-primary mb-6">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
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
                      
                      {form.watch("paymentMethod") === "credit" || form.watch("paymentMethod") === "debit" ? (
                        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número do Cartão</FormLabel>
                                <FormControl>
                                  <Input placeholder="0000 0000 0000 0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Validade</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/AA" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVC</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ) : form.watch("paymentMethod") === "pix" ? (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="text-center space-y-4">
                            <p className="font-medium text-lg">QR Code para pagamento PIX</p>
                            <div className="flex justify-center">
                              <img 
                                src={pixQRCodeURL} 
                                alt="QR Code PIX" 
                                className="border p-2 bg-white rounded-lg" 
                                width={200} 
                                height={200}
                              />
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                              <p>Escaneie o QR Code acima com o aplicativo do seu banco</p>
                              <p>Valor a pagar: <span className="font-semibold">R$ {total.toFixed(2)}</span></p>
                            </div>
                            <div className="border-t pt-3 mt-3">
                              <p className="font-medium">Instruções:</p>
                              <ol className="text-sm text-left list-decimal pl-5 pt-2">
                                <li>Abra o aplicativo do seu banco</li>
                                <li>Selecione a opção PIX</li>
                                <li>Escaneie o QR Code</li>
                                <li>Confirme as informações e o valor</li>
                                <li>Finalize o pagamento</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      
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
