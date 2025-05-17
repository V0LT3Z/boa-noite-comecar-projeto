
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

const EmptyProducts = () => {
  return (
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-md">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Gift className="h-16 w-16 text-primary/40 mb-6" />
        <h3 className="text-xl font-bold mb-2">Nenhum produto encontrado</h3>
        <p className="text-center text-dashboard-muted mb-6 max-w-md">
          Você ainda não adquiriu nenhum produto. Fique atento às nossas promoções e produtos exclusivos dos seus eventos favoritos!
        </p>
        <Button asChild>
          <Link to="/eventos">Ver eventos disponíveis</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyProducts;
