
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { UserTicket } from "@/types/event";
import { fetchUserTickets } from "@/services/events";
import { toast } from "@/hooks/use-toast";

// Import components
import TicketsLoading from "@/components/tickets/TicketsLoading";
import TicketsHeader from "@/components/tickets/TicketsHeader";
import TicketsTabs from "@/components/tickets/TicketsTabs";

const MyTickets = () => {
  const { user } = useAuth();
  const { isLoading } = useProtectedRoute();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const userTickets = await fetchUserTickets();
      setTickets(userTickets);
    } catch (error) {
      console.error("Erro ao carregar ingressos:", error);
      toast({
        title: "Erro ao carregar ingressos",
        description: "Não foi possível buscar seus ingressos. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTickets(false);
    }
  };
  
  if (isLoading || isLoadingTickets) {
    return <TicketsLoading />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dashboard-card pb-10">
      <div className="max-w-4xl mx-auto px-4 pt-6 text-center">
        <TicketsHeader />
        <TicketsTabs tickets={tickets} />
      </div>
    </div>
  );
};

export default MyTickets;
