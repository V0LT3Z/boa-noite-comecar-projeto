
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OrderSummary from "@/components/checkout/OrderSummary";
import CardForm from "@/components/checkout/CardForm";
import PixQRCode from "@/components/checkout/PixQRCode";
import { toast } from "@/components/ui/sonner";
import { useProtectedRoute } from "@/hooks/use-protected-route";

const Checkout = () => {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get order data from location state or use default
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
    ]
  };

  const handleSubmitCard = async (cardData: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Card payment data:", cardData);
      console.log("Order data:", orderData);
      
      toast({
        title: "Pagamento aprovado!",
        description: "Seus ingressos foram enviados para seu email.",
        variant: "success"
      });
      
      navigate("/pagamento-sucesso", { 
        state: { 
          orderData,
          paymentMethod: "card"
        } 
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitPix = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("PIX payment for order:", orderData);
      
      toast({
        title: "Pagamento via PIX aprovado!",
        description: "Seus ingressos foram enviados para seu email.",
        variant: "success"
      });
      
      navigate("/pagamento-sucesso", { 
        state: { 
          orderData, 
          paymentMethod: "pix" 
        } 
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
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
