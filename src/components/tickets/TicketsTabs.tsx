
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Ticket } from "lucide-react";
import { UserTicket } from "@/types/event";
import TicketsContent from "./TicketsContent";
import EmptyProducts from "./EmptyProducts";

interface TicketsTabsProps {
  tickets: UserTicket[];
}

const TicketsTabs = ({ tickets }: TicketsTabsProps) => {
  return (
    <Tabs defaultValue="ingressos" className="w-full">
      <TabsList className="w-full grid grid-cols-2 bg-dashboard-card rounded-xl h-12 p-1 mb-6">
        <TabsTrigger 
          value="ingressos"
          className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
        >
          <Ticket className="mr-2 h-4 w-4" />
          Ingressos
        </TabsTrigger>
        <TabsTrigger 
          value="produtos"
          className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
        >
          <Gift className="mr-2 h-4 w-4" />
          Produtos
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="ingressos" className="animate-fade-in">
        <TicketsContent tickets={tickets} />
      </TabsContent>
      
      <TabsContent value="produtos" className="animate-fade-in">
        <EmptyProducts />
      </TabsContent>
    </Tabs>
  );
};

export default TicketsTabs;
