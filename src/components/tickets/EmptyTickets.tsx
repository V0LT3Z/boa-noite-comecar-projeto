
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

const EmptyTickets = () => {
  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-md animate-fade-in">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Ticket className="h-16 w-16 text-primary/40 mb-6" />
        <h3 className="text-xl font-bold mb-2">Nenhum ingresso encontrado</h3>
        <p className="text-center text-dashboard-muted mb-6 max-w-md">
          Parece que você ainda não adquiriu nenhum ingresso. Explore os eventos disponíveis para encontrar algo do seu interesse!
        </p>
        <Button asChild>
          <Link to="/eventos">Ver eventos disponíveis</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTickets;
