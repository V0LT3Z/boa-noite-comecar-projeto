
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";

const AdminEvents = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {isCreatingEvent ? (
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={() => setIsCreatingEvent(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Criar Novo Evento</h1>
            </div>
            <EventForm />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
              <Button onClick={() => setIsCreatingEvent(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
              </Button>
            </div>
            
            <div className="border rounded-lg p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento cadastrado</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreatingEvent(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Criar primeiro evento
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
