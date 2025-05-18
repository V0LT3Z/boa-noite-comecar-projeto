
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchEventById } from "@/services/events";
import { EventDetails } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";

export const useEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEventDetails() {
      if (!id) {
        toast.error("Evento não encontrado", {
          description: "Nenhum evento especificado.",
        });
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const eventId = parseInt(id);
        if (isNaN(eventId)) {
          throw new Error("ID do evento inválido");
        }

        const eventData = await fetchEventById(eventId);

        if (eventData) {
          setEvent(eventData);
        } else {
          throw new Error("Evento não encontrado");
        }
      } catch (error) {
        setError("Não foi possível encontrar os detalhes para este evento.");
        toast.error("Evento não encontrado", {
          description: "Não foi possível encontrar os detalhes para este evento.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadEventDetails();
  }, [id, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePurchase = async (selectedTickets: { ticketId: number, quantity: number }[]) => {
    if (!id || selectedTickets.length === 0) {
      toast.error("Dados inválidos", { 
        description: "Por favor, selecione pelo menos um ingresso." 
      });
      return;
    }

    try {
      setIsPurchasing(true);
      
      console.log("Creating checkout session for event:", id);
      console.log("Selected tickets:", selectedTickets);
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          eventId: parseInt(id),
          selectedTickets
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (!data) {
        console.error("No data received from create-checkout function");
        throw new Error("Nenhuma resposta recebida do servidor");
      }

      if (data.success && data.checkoutData) {
        console.log("Checkout data received, navigating to checkout page:", data.checkoutData);
        navigate('/checkout', { state: { orderData: data.checkoutData } });
      } else if (data?.error) {
        console.error("Error received from create-checkout:", data.error);
        throw new Error(data.error);
      } else {
        console.error("Unexpected response format:", data);
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      toast.error("Erro no processo de compra", {
        description: `${error.message || "Ocorreu um erro ao processar sua compra. Por favor, tente novamente."}`
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    event,
    isLoading,
    error,
    isPurchasing,
    handleBackToHome,
    handlePurchase
  };
};
