
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import { useAdminEvents } from "@/contexts/AdminEventsContext";

export const EventFormWrapper = () => {
  const { editingEvent, handleFormBack, handleFormSuccess } = useAdminEvents();

  return (
    <>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={handleFormBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {editingEvent ? `Editar Evento: ${editingEvent.title}` : "Criar Novo Evento"}
        </h1>
      </div>
      <EventForm event={editingEvent} onSuccess={handleFormSuccess} />
    </>
  );
};
