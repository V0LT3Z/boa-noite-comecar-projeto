
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentSuccessConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId }
        });

        if (error) throw error;
        if (!data) throw new Error("Nenhum dado recebido");

        setOrderDetails(data);
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
        toast({
          title: "Erro na verificação",
          description: "Não foi possível confirmar seu pagamento. Entre em contato com o suporte.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Confirmando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Pagamento Confirmado!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {orderDetails && (
              <>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">{orderDetails.event.title}</h3>
                  <p className="text-sm text-gray-600">{orderDetails.event.date}</p>
                  <p className="text-sm text-gray-600">{orderDetails.event.location}</p>
                </div>

                <div className="space-y-2">
                  {orderDetails.tickets.map((ticket: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{ticket.name} × {ticket.quantity}</span>
                      <span className="font-medium">
                        R$ {(ticket.price * ticket.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        R$ {orderDetails.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Seus ingressos foram enviados para seu e-mail.
                Você também pode acessá-los a qualquer momento em "Meus Ingressos".
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>
            <Button onClick={() => navigate("/meus-ingressos")}>
              Ver meus ingressos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessConfirmation;
