
import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EventFormValues } from "./eventFormSchema";
import TicketTypeCard from "./TicketTypeCard";

interface TicketTypesSectionProps {
  addTicketType: () => void;
  removeTicketType: (index: number) => void;
  isDeletingTicket: number | null;
}

const TicketTypesSection = ({ 
  addTicketType, 
  removeTicketType, 
  isDeletingTicket 
}: TicketTypesSectionProps) => {
  const { watch } = useFormContext<EventFormValues>();
  const tickets = watch("tickets");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tipos de Ingressos</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addTicketType}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Tipo
        </Button>
      </div>

      {tickets?.map((_, index) => (
        <TicketTypeCard 
          key={index} 
          index={index} 
          onRemove={removeTicketType} 
          isDeleting={isDeletingTicket} 
        />
      ))}
    </div>
  );
};

export default TicketTypesSection;
