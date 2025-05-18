
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EventFormHeaderProps {
  isEditing: boolean;
  eventTitle?: string;
  onBack: () => void;
}

const EventFormHeader = ({ isEditing, eventTitle, onBack }: EventFormHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="ghost" 
        className="mr-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      <h1 className="text-3xl font-bold tracking-tight">
        {isEditing ? `Editar Evento: ${eventTitle}` : "Criar Novo Evento"}
      </h1>
    </div>
  );
};

export default EventFormHeader;
