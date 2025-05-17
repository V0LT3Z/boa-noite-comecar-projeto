
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
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-dashboard-card">
      <div className="max-w-4xl mx-auto px-4 pt-6 text-center flex-grow">
        <TicketsHeader />
        <TicketsTabs tickets={tickets} />
      </div>
      
      {/* Banner no rodapé */}
      <div className="w-full mt-10">
        <img 
          src="/lovable-uploads/91b2e929-a143-4191-b4bb-b66c4ec76219.png" 
          alt="Nokta Tickets" 
          className="w-full h-auto max-h-48 object-contain"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default MyTickets;
