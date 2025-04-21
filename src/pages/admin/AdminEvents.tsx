
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminEvents = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Eventos</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Novo Evento
          </Button>
        </div>
        
        <div className="border rounded-lg p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Lista de eventos será implementada em breve</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
