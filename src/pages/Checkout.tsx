
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderSummary from "@/components/checkout/OrderSummary";
import CardForm from "@/components/checkout/CardForm";
import PixQRCode from "@/components/checkout/PixQRCode";
import { toast } from "sonner";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { createOrder } from "@/services/orders";

const Checkout = () => {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get order data from location state or use fallback if accessed directly
  const orderData = location.state?.orderData || {
    event: {
      id: 1,
      title: "Festival de Música",
      date: "20/05/2025",
      time: "16:00",
      location: "Parque da Cidade, São Paulo",
      image: "https://picsum.photos/seed/event1/800/500",
    },
    tickets: [
      { id: 1, name: "Ingresso Comum", price: 150.0, quantity: 2 },
      { id: 2, name: "Ingresso VIP", price: 300.0, quantity: 1 }
    ],
    orderId: `order-${Date.now()}`
  };

  const handleSubmitCard = async (data: any) => {
    await processPayment("card", data);
  };
  
  const handleSubmitPix = async () => {
    await processPayment("pix");
  };

  const processPayment = async (paymentMethod: string, cardData?: any) => {
    setIsSubmitting(true);
    
    try {
      // For demonstration, we'll use the orders service to create an order
      const selectedTickets = orderData.tickets.map((ticket: any) => ({
        ticketId: ticket.id,
        quantity: ticket.quantity,
      }));

      // Create order in the database
      await createOrder(
        orderData.event.id,
        selectedTickets,
        paymentMethod
      );
      
      // Navigate to success page
      navigate('/pagamento-sucesso', { 
        state: { 
          sessionId: orderData.orderId,
          eventInfo: orderData.event,
          tickets: orderData.tickets
        } 
      });
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro no pagamento", {
        description: "Não foi possível processar o pagamento. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Finalizar Compra
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="card">Cartão de Crédito</TabsTrigger>
                <TabsTrigger value="pix">PIX</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card">
                <CardForm onSubmit={handleSubmitCard} isSubmitting={isSubmitting} />
              </TabsContent>
              
              <TabsContent value="pix">
                <PixQRCode 
                  amount={orderData.tickets.reduce(
                    (total: number, ticket: any) => total + (ticket.price * ticket.quantity), 
                    0
                  )} 
                  onConfirm={handleSubmitPix}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <OrderSummary orderData={orderData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
