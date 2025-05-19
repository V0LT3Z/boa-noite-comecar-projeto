
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAdminEvents } from "@/contexts/AdminEventsContext";

export const EventListHeader = () => {
  const { handleNewEvent } = useAdminEvents();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
      <div className="flex gap-3">
        <Button onClick={handleNewEvent}>
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>
    </div>
  );
};
