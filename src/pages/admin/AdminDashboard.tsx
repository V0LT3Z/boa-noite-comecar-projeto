
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BarChart2, Calendar, DollarSign, Ticket, Users } from "lucide-react";

const statsCards = [
  {
    title: "Total de Eventos",
    value: "24",
    description: "8 eventos ativos",
    icon: Calendar,
    color: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  {
    title: "Ingressos Vendidos",
    value: "1,245",
    description: "+12% em relação ao mês passado",
    icon: Ticket,
    color: "bg-gradient-to-r from-blue-400 to-blue-600"
  },
  {
    title: "Usuários Ativos",
    value: "3,721",
    description: "+5% em relação ao mês passado",
    icon: Users,
    color: "bg-gradient-to-r from-pink-400 to-pink-600"
  },
  {
    title: "Faturamento",
    value: "R$ 124.500",
    description: "No último trimestre",
    icon: DollarSign,
    color: "bg-gradient-to-r from-green-400 to-green-600"
  },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="relative space-y-8">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 top-10 w-96 h-96 rounded-full bg-purple-200 opacity-30 blur-3xl"></div>
          <div className="absolute -left-20 top-40 w-80 h-80 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
        </div>
        
        <div>
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/efc2028f-817a-4367-bfd1-0e95034651dc.png" 
              alt="NOKTA TICKETS" 
              className="h-12" 
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                Painel de Controle
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo ao painel de administração para produtores de eventos.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`h-2 ${card.color}`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2.5 rounded-lg text-white`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2 border-none shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6">
              <CardTitle className="text-lg text-purple-800">Visão Geral de Eventos</CardTitle>
              <CardDescription>Eventos programados para os próximos 30 dias</CardDescription>
            </div>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-white/50 border border-dashed rounded-xl overflow-hidden">
                <div className="flex flex-col items-center gap-2">
                  <BarChart2 className="h-10 w-10 text-purple-500" />
                  <p className="font-medium">Gráfico de eventos programados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-none shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
              <CardTitle className="text-lg text-blue-800">Próximos Eventos</CardTitle>
              <CardDescription>Eventos com início próximo</CardDescription>
            </div>
            <CardContent className="p-6">
              <div className="space-y-5">
                {["Festa Junina", "Show de Rock", "Festival de Verão"].map((event, i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3"></div>
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
