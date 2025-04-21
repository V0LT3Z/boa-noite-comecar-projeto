
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyEventsListProps {
  onCreateEvent: () => void;
}

export const EmptyEventsList = ({ onCreateEvent }: EmptyEventsListProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Nenhum evento encontrado</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onCreateEvent}
      >
        <Plus className="mr-2 h-4 w-4" /> Criar primeiro evento
      </Button>
    </div>
  );
};
