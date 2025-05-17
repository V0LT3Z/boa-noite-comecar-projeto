
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TicketsHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="mb-2 self-start">
        <Link to="/minha-conta">
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full text-primary hover:bg-primary/5">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Meus Ingressos
      </h1>
      <p className="text-sm text-dashboard-muted">
        Gerencie todos os seus ingressos e produtos comprados
      </p>
    </div>
  );
};

export default TicketsHeader;
