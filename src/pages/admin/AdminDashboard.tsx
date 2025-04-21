
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BarChart2, Calendar, DollarSign, Ticket, Users } from "lucide-react";

const statsCards = [
  {
    title: "Total de Eventos",
    value: "24",
    description: "8 eventos ativos",
    icon: Calendar,
    color: "bg-blue-500"
  },
  {
    title: "Ingressos Vendidos",
    value: "1,245",
    description: "+12% em relação ao mês passado",
    icon: Ticket,
    color: "bg-green-500"
  },
  {
    title: "Usuários Ativos",
    value: "3,721",
    description: "+5% em relação ao mês passado",
    icon: Users,
    color: "bg-purple-500"
  },
  {
    title: "Faturamento",
    value: "R$ 124.500",
    description: "No último trimestre",
    icon: DollarSign,
    color: "bg-amber-500"
  },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de administração para produtores de eventos.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-full text-white`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Visão Geral de Eventos</CardTitle>
              <CardDescription>Eventos programados para os próximos 30 dias</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                <div className="flex flex-col items-center gap-2">
                  <BarChart2 className="h-10 w-10" />
                  <p>Gráfico de eventos programados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Eventos com início próximo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Festa Junina", "Show de Rock", "Festival de Verão"].map((event, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
